# CLAUDE.md — Bulldog Dermatitis Knowledge Base Project

## Project Overview

A community-driven, evidence-checked knowledge base for bulldog skin health — focusing on Malassezia dermatitis, alopecia, atopic dermatitis, and related conditions. The site publishes a comprehensive reference handbook and allows bulldog owners, breeders, and veterinary professionals to contribute their experiences, which are continuously validated against the veterinary dermatology literature.

**Core principle:** Every piece of community-contributed information is evidence-checked before publication. The site bridges the gap between peer-reviewed veterinary science and real-world bulldog ownership experience.

## Architecture

### Site Structure

```
bulldogderm.com/                    (or similar domain)
├── /                               Landing page + handbook download
├── /handbook                       Full handbook rendered as web pages (20 sections)
│   ├── /understanding              Part I: Clinical framing
│   ├── /diagnosis                  Part II: Diagnostic workup
│   ├── /treatment                  Part III: Treatment protocols
│   ├── /environment                Part IV: Environmental & nutritional
│   └── /maintenance                Part V: Long-term management
├── /community                      Community contributions hub
│   ├── /submit                     Submission form for new entries
│   ├── /verified                   Verified community insights (evidence-checked)
│   ├── /under-review               Submissions pending validation
│   └── /rejected                   Rejected submissions with explanations
├── /resources                      Vet dermatologist directory, product links, cost guides
├── /about                          About the project, methodology, disclaimers
└── /api                            Backend for submission, validation, rendering
```

### Tech Stack (Recommended)

- **Frontend:** Next.js (React) with Tailwind CSS — SSG for handbook pages, SSR for community content
- **Backend:** Next.js API routes or separate FastAPI service
- **Database:** PostgreSQL (Supabase or Neon) for community submissions, user accounts, validation state
- **Auth:** Supabase Auth or Clerk — email-based, optional social login
- **AI Validation:** Anthropic Claude API (claude-sonnet-4-20250514) for automated evidence checking
- **Hosting:** Vercel (frontend) + Supabase (DB + auth + storage)
- **PDF:** Serve the static handbook PDF from `/public/` or a CDN

## Evidence Validation System

### How Community Contributions Are Checked

Every submission goes through a three-stage validation pipeline:

#### Stage 1: Automated Evidence Check (Claude API)
When a user submits a new insight, remedy, or experience report, the system calls Claude with the following prompt structure:

```
System: You are a veterinary dermatology evidence checker. You have access to the
current veterinary literature on canine Malassezia dermatitis, atopic dermatitis,
and related conditions. Your job is to evaluate community-submitted claims for
accuracy, safety, and clinical relevance.

For each submission, provide:
1. VERDICT: one of [VALIDATED, PLAUSIBLE, UNSUBSTANTIATED, HARMFUL, NEEDS_CONTEXT]
2. EVIDENCE_SUMMARY: 2-3 sentences explaining the evidence basis
3. SAFETY_FLAG: any safety concerns (toxicity, drug interactions, delay of necessary care)
4. SUGGESTED_CAVEATS: any caveats that should accompany the claim if published
5. REFERENCES: relevant veterinary literature citations

User: [Community submission text]
```

#### Stage 2: Community Review
- Submissions with VALIDATED or PLAUSIBLE verdicts are published to `/under-review` with the AI assessment visible
- Other community members can upvote, comment, or flag
- Minimum 48-hour review period before moving to `/verified`

#### Stage 3: Editorial Review (Optional)
- Submissions flagged as HARMFUL are immediately rejected with explanation
- Submissions with NEEDS_CONTEXT are held for manual review
- A volunteer veterinary advisor (ideally DACVD or DVM) can be engaged for edge cases

### Validation Verdicts

| Verdict | Meaning | Action |
|---------|---------|--------|
| VALIDATED | Supported by peer-reviewed veterinary literature | Publish to `/verified` with evidence summary |
| PLAUSIBLE | Mechanism is sound but direct clinical evidence is limited | Publish with caveats |
| UNSUBSTANTIATED | No evidence basis found; not necessarily wrong but not confirmable | Hold; explain why |
| HARMFUL | Could cause harm to the animal (toxicity, delayed care, dangerous interaction) | Reject immediately with safety explanation |
| NEEDS_CONTEXT | Depends on specific clinical circumstances | Hold for editorial/veterinary review |

## Data Models

### Submission

```typescript
interface Submission {
  id: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  
  // Content
  title: string;                    // e.g., "Apple cider vinegar rinse for paw yeast"
  body: string;                     // Full description of the remedy/insight/experience
  category: SubmissionCategory;     // REMEDY | EXPERIENCE | PRODUCT | TIP | QUESTION
  tags: string[];                   // e.g., ["paws", "topical", "yeast", "diy"]
  dog_breed: string;                // e.g., "English Bulldog"
  dog_age?: string;                 // e.g., "3 years"
  condition: string;                // e.g., "Malassezia pododermatitis"
  
  // Validation
  validation_status: ValidationStatus;  // PENDING | UNDER_REVIEW | VERIFIED | REJECTED
  ai_verdict: Verdict;
  ai_evidence_summary: string;
  ai_safety_flags: string[];
  ai_suggested_caveats: string[];
  ai_references: string[];
  editorial_notes?: string;
  reviewed_by?: string;             // DVM reviewer ID if applicable
  
  // Community
  upvotes: number;
  downvotes: number;
  comment_count: number;
  flagged: boolean;
  flag_reason?: string;
}

type SubmissionCategory = 'REMEDY' | 'EXPERIENCE' | 'PRODUCT' | 'TIP' | 'QUESTION';
type ValidationStatus = 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED';
type Verdict = 'VALIDATED' | 'PLAUSIBLE' | 'UNSUBSTANTIATED' | 'HARMFUL' | 'NEEDS_CONTEXT';
```

### User

```typescript
interface User {
  id: string;
  email: string;
  display_name: string;
  role: 'OWNER' | 'BREEDER' | 'VET_TECH' | 'DVM' | 'DACVD' | 'MODERATOR' | 'ADMIN';
  dogs: DogProfile[];
  joined_at: string;
  submission_count: number;
  verified_submission_count: number;
}

interface DogProfile {
  name: string;
  breed: string;
  age_years: number;
  conditions: string[];           // e.g., ["atopic dermatitis", "Malassezia dermatitis"]
  current_treatments: string[];   // e.g., ["Cytopoint monthly", "miconazole-CHG baths 2x/week"]
}
```

## Content Guidelines

### What We Publish
- Owner experience reports with specific treatments and outcomes
- Product recommendations with evidence assessment
- Environmental management strategies
- Dietary observations (with elimination diet methodology caveats)
- Cost and accessibility information
- Veterinary clinic/dermatologist reviews and recommendations

### What We Do NOT Publish
- Claims that any supplement or remedy can "cure" allergies or yeast permanently
- Anti-veterinary sentiment or advice to avoid veterinary care
- Recommendations for substances toxic to dogs (garlic, tea tree oil at high concentrations, etc.)
- Unvalidated diagnostic claims (e.g., "urine mycotoxin testing proves mold caused the yeast")
- Promotion of commercial food allergy blood/saliva tests as diagnostic
- Misinformation about dietary yeast causing Malassezia dermatitis

### Tone and Voice
- Empathetic but rigorous — bulldog owners are dealing with a frustrating, chronic condition
- Evidence-first but not dismissive of community experience
- Acknowledge that veterinary care is expensive and not always accessible
- Never shame an owner for trying a home remedy — explain what works and what doesn't, and why
- Always emphasize: the yeast is the symptom, not the disease

## Development Priorities

### Phase 1: Static Site + Handbook (MVP)
- [ ] Deploy Next.js site with handbook content rendered as static pages
- [ ] PDF download of the comprehensive handbook
- [ ] Basic SEO for bulldog dermatitis search terms
- [ ] About page with methodology and disclaimers
- [ ] Contact/feedback form

### Phase 2: Community Submissions
- [ ] User authentication (Supabase Auth)
- [ ] Submission form with structured fields
- [ ] Claude API integration for automated evidence checking
- [ ] `/under-review` and `/verified` pages
- [ ] Basic upvote/comment system

### Phase 3: Community Features
- [ ] User profiles with dog profiles
- [ ] Submission history and track record
- [ ] DVM/DACVD verified accounts with badge
- [ ] Notification system for submission status updates
- [ ] Search and filter across verified submissions

### Phase 4: Advanced
- [ ] Vet dermatologist directory with map (ACVD data)
- [ ] Treatment cost estimator by region
- [ ] Symptom checker / triage flowchart (interactive, not diagnostic)
- [ ] Integration with veterinary telehealth platforms
- [ ] Mobile app (React Native or Expo)

## AI Integration Details

### Claude API Usage

**Model:** claude-sonnet-4-20250514 (for validation — fast, accurate, cost-effective)

**Rate limiting:** Queue submissions; process in batch every 15 minutes or on-demand for premium users.

**Prompt engineering notes:**
- Include the handbook's reference list as grounding context in the system prompt
- Instruct Claude to cite specific veterinary sources when validating
- For HARMFUL verdicts, require Claude to explain the specific danger mechanism
- Temperature: 0 (deterministic for validation tasks)
- Max tokens: 1000 (validation responses should be concise)

**Cost estimate:** ~$0.01-0.03 per validation call. At 100 submissions/day = ~$1-3/day.

### Example Validation Call

```javascript
const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": process.env.ANTHROPIC_API_KEY,
    "anthropic-version": "2023-06-01"
  },
  body: JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    temperature: 0,
    system: `You are a veterinary dermatology evidence checker specializing in canine 
Malassezia dermatitis and bulldog skin conditions. Evaluate the following community 
submission for accuracy, safety, and clinical relevance.

Respond in JSON format with these fields:
- verdict: VALIDATED | PLAUSIBLE | UNSUBSTANTIATED | HARMFUL | NEEDS_CONTEXT
- evidence_summary: string (2-3 sentences)
- safety_flags: string[] (empty array if none)
- suggested_caveats: string[] (caveats to accompany if published)
- references: string[] (relevant veterinary literature)

Key safety rules:
- Flag any substance toxic to dogs (garlic, xylitol, high-concentration tea tree oil, etc.)
- Flag any advice that delays necessary veterinary care
- Flag any claim that a supplement can "cure" atopic dermatitis
- Validate against ACVD consensus, peer-reviewed vet derm literature, and PMC sources`,
    messages: [{
      role: "user",
      content: `Submission: "${submissionText}"\n\nCategory: ${category}\nCondition: ${condition}`
    }]
  })
});
```

## Legal / Disclaimers

Every page must display:
> This site is for educational and informational purposes only. It does not constitute veterinary advice. All diagnostic and treatment decisions should be made in consultation with a licensed veterinarian. Community-contributed content has been evaluated against veterinary literature but has not been reviewed by a veterinary licensing board. If your dog is experiencing a medical emergency, contact your veterinarian or emergency animal hospital immediately.

## File Structure for Development

```
bulldog-derm/
├── CLAUDE.md                       # This file
├── README.md                       # Public-facing project description
├── package.json
├── next.config.js
├── tailwind.config.js
├── public/
│   ├── bulldog_dermatitis_handbook.pdf
│   └── images/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                # Landing page
│   │   ├── handbook/
│   │   │   └── [section]/page.tsx  # Dynamic handbook pages
│   │   ├── community/
│   │   │   ├── page.tsx            # Community hub
│   │   │   ├── submit/page.tsx     # Submission form
│   │   │   ├── verified/page.tsx   # Verified submissions
│   │   │   └── [id]/page.tsx       # Individual submission
│   │   ├── resources/page.tsx
│   │   └── about/page.tsx
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── SubmissionCard.tsx
│   │   ├── ValidationBadge.tsx
│   │   ├── EvidencePanel.tsx
│   │   └── HandbookNav.tsx
│   ├── lib/
│   │   ├── supabase.ts             # DB client
│   │   ├── claude.ts               # Claude API validation client
│   │   ├── validation.ts           # Validation pipeline logic
│   │   └── handbook-content.ts     # Handbook sections as structured data
│   └── types/
│       └── index.ts                # TypeScript interfaces
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # DB schema
└── docs/
    ├── handbook-source/            # Handbook content in markdown
    └── evidence-library/           # Reference PDFs and citations
```

## Key Design Decisions

1. **Evidence-first, not opinion-first.** Community content is valuable but must be checked. We don't censor — we contextualize.

2. **The handbook is the anchor.** The static handbook represents the current state of evidence. Community contributions extend it but don't override it.

3. **Transparency in validation.** Users see the AI's evidence assessment alongside every submission. Nothing is hidden.

4. **Veterinary care is always recommended.** The site helps owners be better informed, not replace their vet. Every treatment section emphasizes the importance of cytology confirmation and underlying cause investigation.

5. **Bulldog-specific, not generic.** The content is tailored to brachycephalic breeds with skin folds. Generic dog health advice is out of scope.

6. **Low barrier to contribute, high bar to publish.** Anyone can submit. Only evidence-checked content reaches the `/verified` feed.
