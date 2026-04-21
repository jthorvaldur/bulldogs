/**
 * BulldogDerm API Worker — Cloudflare Workers
 *
 * Endpoints:
 *   POST /api/validate  — AI evidence-checking via Claude API
 *   GET  /api/health     — Health check
 *
 * Environment variables (set via wrangler secret):
 *   ANTHROPIC_API_KEY — Anthropic API key for Claude
 *
 * Deploy:
 *   cd worker && npx wrangler deploy
 */

export interface Env {
  ANTHROPIC_API_KEY: string;
}

interface Submission {
  title: string;
  category: string;
  condition: string;
  body: string;
  breed?: string;
  tags?: string[];
}

interface ValidationResult {
  verdict: 'VALIDATED' | 'PLAUSIBLE' | 'UNSUBSTANTIATED' | 'HARMFUL' | 'NEEDS_CONTEXT';
  evidence_summary: string;
  safety_flags: string[];
  suggested_caveats: string[];
  references: string[];
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const SYSTEM_PROMPT = `You are a veterinary dermatology evidence checker specializing in canine Malassezia dermatitis and bulldog skin conditions. Evaluate the following community submission for accuracy, safety, and clinical relevance.

Respond in JSON format with these fields:
- verdict: VALIDATED | PLAUSIBLE | UNSUBSTANTIATED | HARMFUL | NEEDS_CONTEXT
- evidence_summary: string (2-3 sentences)
- safety_flags: string[] (empty array if none)
- suggested_caveats: string[] (caveats to accompany if published)
- references: string[] (relevant veterinary literature)

Key safety rules:
- Flag any substance toxic to dogs (garlic, xylitol, high-concentration tea tree oil, grapes, onions, etc.)
- Flag any advice that delays necessary veterinary care
- Flag any claim that a supplement can "cure" atopic dermatitis
- Flag long-term corticosteroid use as harmful
- Validate against ACVD consensus, peer-reviewed vet derm literature, and PMC sources

Key evidence sources you should reference when applicable:
[1] PMC5603939 — Canine Malassezia dermatitis diagnosis/significance
[2] Hobi et al. 2024 — Malassezia dermatitis in dogs and cats
[3] ACVD Task Force — Malassezia as atopic dermatitis complication
[5] Hensel et al. 2015 — Canine atopic dermatitis guidelines (BMC Vet Res)
[10] PMC9754143 — Malassezia species in canine skin disease
[18] Gober et al. 2022 (PMC9343842) — Cytopoint efficacy: 94% success Day 7, 100% Day 56

Remember: The yeast is the symptom, not the disease. Always consider underlying causes.`;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    // Health check
    if (url.pathname === '/api/health') {
      return Response.json(
        { status: 'ok', hasApiKey: !!env.ANTHROPIC_API_KEY },
        { headers: CORS_HEADERS }
      );
    }

    // Validation endpoint
    if (url.pathname === '/api/validate' && request.method === 'POST') {
      try {
        const submission: Submission = await request.json();

        if (!submission.title || !submission.body) {
          return Response.json(
            { error: 'Title and body are required' },
            { status: 400, headers: CORS_HEADERS }
          );
        }

        if (!env.ANTHROPIC_API_KEY) {
          return Response.json(
            { error: 'API key not configured' },
            { status: 503, headers: CORS_HEADERS }
          );
        }

        const result = await validateWithClaude(env.ANTHROPIC_API_KEY, submission);
        return Response.json(result, { headers: CORS_HEADERS });
      } catch (err) {
        return Response.json(
          { error: 'Validation failed', message: (err as Error).message },
          { status: 500, headers: CORS_HEADERS }
        );
      }
    }

    return Response.json(
      { error: 'Not found' },
      { status: 404, headers: CORS_HEADERS }
    );
  },
};

async function validateWithClaude(apiKey: string, submission: Submission): Promise<ValidationResult> {
  const userMessage = `Submission: "${submission.title}"

Description: ${submission.body}

Category: ${submission.category}
Condition: ${submission.condition}
Breed: ${submission.breed || 'Not specified'}
Tags: ${(submission.tags || []).join(', ') || 'None'}`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      temperature: 0,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Claude API error: ${response.status} ${errText}`);
  }

  const data = await response.json() as any;
  const text = data.content?.[0]?.text || '';

  // Parse JSON from response (handle markdown code blocks)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not parse validation response');
  }

  const result: ValidationResult = JSON.parse(jsonMatch[0]);

  // Safety: ensure harmful verdicts have safety flags
  if (result.verdict === 'HARMFUL' && result.safety_flags.length === 0) {
    result.safety_flags = ['This submission was flagged as potentially harmful. Consult your veterinarian.'];
  }

  return result;
}
