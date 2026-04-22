# BulldogDerm Strategy — From Project to Product

## The Moat

No other bulldog health site **systematically evidence-checks community contributions**. Generic pet sites (PetMD, VCA) have authority but no community. Community sites (Reddit, breed forums) have experience but no validation. BulldogDerm bridges both. That bridge is the product.

---

## Phase 1: Make It Actually Usable (Weeks 1-4)

### Problem: A bulldog owner at 11pm doesn't need 20 chapters

**1. Symptom Triage Tool (highest impact, build first)**
- "What's happening with your bulldog right now?" — 4 buttons on the landing page
- Paws: red, licking, swollen → immediate protocol + "see vet for cytology"
- Ears: shaking, discharge, smell → ear care protocol + otitis warning signs
- Skin folds: oozing, red, smell → fold care protocol + when to escalate
- All over: scratching won't stop → itch management + underlying cause checklist
- Each path ends with: "Do these 3 things tonight, call your vet tomorrow"
- This is the single most important feature for real users

**2. Shopping Lists with Product Links**
- "For the paw yeast protocol you need:" → specific products with affiliate links
- Chlorhexidine 2% gallon (Chewy link) — $18
- Povidone-iodine 10% solution (Amazon link) — $8
- Spray bottles, paw soak basin, drying towels
- Miconazole-CHG shampoo: Malaseb (Chewy link) — $15
- This is also the primary revenue mechanism (see Revenue section)

**3. SEO Foundation**
- Add `sitemap.xml`, `robots.txt`
- Open Graph + Twitter meta tags on every page
- Schema.org structured data: `MedicalWebPage`, `FAQPage` on handbook
- Unique meta descriptions per page targeting specific search queries
- Target keywords: "bulldog yeast infection treatment", "dog paw yeast home remedy", "malassezia dog shampoo"

**4. Mobile Fixes**
- Make handbook tables horizontally scrollable
- Responsive canvas elements (remove fixed width/height attributes)
- Touch-friendly form inputs (minimum 44px tap targets)
- Print stylesheet for handbook (owners print protocols for their vet)

---

## Phase 2: Make It Sticky — Why Come Back (Weeks 5-12)

### Problem: Owner reads handbook once, never returns

**5. Symptom Tracker**
- Daily itch score (1-10 slider)
- Weekly photo upload (paws, folds, ears)
- Auto-generated progress chart over time
- "You're on week 3 of treatment — here's what to expect"
- Built with localStorage initially (no backend), Supabase later
- This is what turns a one-visit resource into a daily tool

**6. Protocol Timer/Reminder**
- "Bath day" reminders (twice weekly)
- "Fold check" daily notification
- "Vet follow-up" at 3-4 weeks
- Simple: browser notifications + add-to-calendar links
- Doesn't need a mobile app — PWA with notifications is enough

**7. Owner Success Stories**
- Real journeys: "3 months from disaster to management"
- Include: timeline, cost, what worked, what didn't, emotional reality
- These are the highest-converting content for both SEO and trust
- Format: interview-style, vetted against evidence, published alongside AI assessment

**8. Discussion on Verified Submissions**
- Add comment threads to each verified community submission
- Upvote/helpfulness signals
- "This worked for my dog too" — social proof drives engagement
- Needs a simple backend: Supabase Realtime or even GitHub Discussions API

---

## Phase 3: Revenue — Break Even and Beyond

### Cost Structure

| Expense | Monthly Cost |
|---------|-------------|
| Domain (bulldogderm.com) | ~$1 |
| Hosting (GitHub Pages) | $0 |
| Claude API (validation, ~100 calls/month initially) | $1-3 |
| Cloudflare Worker (free tier) | $0 |
| **Total** | **~$2-4/month** |

Breaking even is trivial. The question is how to build sustainable revenue.

### Revenue Streams (ordered by effort-to-reward ratio)

#### Stream 1: Product Affiliate Links — $500-3,000/month at scale
**Why it works:** Every protocol in the handbook naturally references specific products. Owner reads "use 2% miconazole + 2% chlorhexidine shampoo" and immediately wants to buy it.

- **Chewy Affiliate Program** (4-8% commission): Malaseb shampoo ($15), Douxo S3 Pyo ($18), chlorhexidine wipes, supplements. 15-day cookie.
- **Amazon Associates** (1-3%): OTC products like Lotrimin, Epsom salt, spray bottles, povidone-iodine.
- **1-800-PetMeds** (~8-10%): Prescription products (ketoconazole, cefpodoxime).

**Implementation:** Add a "Products You'll Need" section to each protocol page. Create a `/resources` page with curated product lists organized by condition. Add affiliate links inline in handbook treatment sections where products are named.

**Revenue math:** 10,000 monthly visitors × 5% click product link × 15% convert on retailer = 75 sales/month × $2 avg commission = $150/month. At 50,000 visitors: $750/month. At 100,000: $1,500/month.

#### Stream 2: Pet Insurance Affiliate — $500-5,000/month at scale
**Why it works:** Bulldog owners reading about chronic dermatitis costs ($2,000-5,000+/year in vet bills) are the highest-intent pet insurance buyers.

- **Lemonade Pet, Healthy Paws, Embrace, Trupanion:** $15-35 per policy sold
- Create: "How Much Does Bulldog Dermatitis Treatment Cost?" article with insurance CTA
- Create: "Does Pet Insurance Cover Cytopoint?" (high-search query, high commercial intent)
- Add cost estimates to each treatment section in handbook

**Revenue math:** Even 10-20 insurance signups/month at $20 commission = $200-400/month. At scale with SEO: $1,000-5,000/month.

#### Stream 3: Veterinary Telehealth Referral — $200-2,000/month
**Why it works:** Owner finishes diagnostic flowchart, result says "consult a veterinary dermatologist." You link them to one.

- **Dutch** (specializes in allergy/dermatitis subscriptions): likely $15-50 per signup
- **Vetster** (marketplace): referral credits
- Add "Talk to a Vet" CTA at key decision points in diagnostic tree and handbook

#### Stream 4: Display Advertising — $0 → $2,000-8,000/month
**Why later:** Needs traffic first.

- **Google AdSense** (entry): $3-8 CPM for pet health content. Available immediately.
- **Mediavine** (50K sessions/month): $15-30 CPM. Pet health content commands premium rates.
- **Raptive/AdThrive** (100K pageviews/month): $20-40 CPM.

**Don't add ads until you have 10,000+ monthly visitors.** Ads on a small site hurt trust and UX without meaningful revenue. Focus on affiliate first.

#### Stream 5: Premium Content / PDF — $100-500/month
**Why it works:** The handbook PDF is already created and valuable.

- Keep the web version free (this is your SEO surface area)
- Gate the "printable protocol cards" behind email signup
- Offer a "Bulldog Skin Health Starter Kit" PDF bundle (checklist + shopping list + protocol cards) for $5-10
- Or: free with email → email list → affiliate revenue from email campaigns

**The email list is more valuable than the PDF revenue.** An engaged list of bulldog owners is worth $1-5/subscriber/month in affiliate and product revenue.

---

## SEO Strategy — Getting Found

### Target Keywords (by priority)

**Tier 1 — High intent, moderate competition:**
- "bulldog yeast infection treatment" (~3,000 searches/month)
- "dog paw yeast home remedy" (~2,000/month)
- "bulldog skin fold infection" (~1,500/month)
- "malassezia dog treatment" (~1,500/month)

**Tier 2 — Product/brand queries (high commercial intent):**
- "malaseb shampoo for dogs" (~3,000/month)
- "douxo shampoo dogs" (~3,000/month)
- "cytopoint for dogs cost" (~5,000/month)
- "apoquel vs cytopoint" (~8,000/month)

**Tier 3 — Long-tail, low competition (easy wins):**
- "bulldog paws smell like fritos" (~500/month)
- "english bulldog nose fold infection" (~300/month)
- "bulldog tail pocket cleaning" (~400/month)
- "how to do cytology on dog at home" (~200/month)

### Content Calendar

Each handbook chapter should become its own SEO-optimized page (not all on one page). The current single-page handbook is good for UX but bad for SEO. Create individual chapter pages that target specific keywords:

| Chapter | Target Page | Target Keyword |
|---------|------------|----------------|
| Ch. 1 | /why-bulldogs-get-yeast | "why does my bulldog smell like yeast" |
| Ch. 3 | /cytology-guide | "dog skin cytology at home" |
| Ch. 8 | /best-antifungal-shampoo-dogs | "best antifungal shampoo for dogs" |
| Ch. 9 | /home-remedies-dog-yeast | "home remedies dog yeast infection" |
| Ch. 12 | /cytopoint-vs-apoquel | "cytopoint vs apoquel for dogs" |
| Ch. 15 | /bulldog-skin-fold-care | "how to clean bulldog skin folds" |
| Ch. 19 | /allergy-shots-dogs-cost | "allergy immunotherapy dogs cost" |

---

## Template Lessons for Other Sites

### What Makes This Replicable

1. **Architecture:** Static HTML + Cloudflare Worker + Claude API. No framework. No database (until community features need one). Cost: ~$2/month.

2. **Evidence-Validation Pattern:** The Claude system prompt is the product. Swap the domain knowledge (vet derm → any niche expertise) and you have the same trust-building machine.

3. **Content-to-Revenue Pipeline:** Authoritative content → SEO traffic → affiliate/referral revenue. The evidence-checking moat makes the content more trustworthy, which increases conversion rates on affiliate links.

### Other Niches This Pattern Could Serve

| Niche | Domain Idea | Why It Works |
|-------|------------|-------------|
| Aquarium health | reeftank.health | Same pattern: community remedies, evidence-checking, product affiliate |
| Sourdough baking | sourdough.guide | Recipe/technique validation against food science |
| Home renovation | fixitright.house | Contractor advice validated against building codes |
| Garden pest control | gardendefense.org | Community pest solutions validated against ag research |
| Car maintenance | mechaniccheck.com | DIY repair advice validated against technical manuals |

Each follows the same formula: **community knowledge + automated evidence-checking + affiliate revenue.**

---

## 90-Day Roadmap

### Month 1: Foundation
- [ ] Buy `bulldogderm.com` domain (~$10)
- [ ] Build symptom triage tool (homepage modal)
- [ ] Add SEO basics (sitemap, Open Graph, schema.org)
- [ ] Sign up for Chewy + Amazon affiliate programs
- [ ] Add product links to treatment chapters
- [ ] Mobile responsiveness fixes
- [ ] Split handbook into individual chapter pages for SEO

### Month 2: Growth
- [ ] Create "Cytopoint vs Apoquel" comparison page (high-search target)
- [ ] Create "How Much Does Bulldog Dermatitis Cost?" page (insurance affiliate)
- [ ] Add 3-5 owner success stories
- [ ] Build email capture (free protocol cards in exchange for email)
- [ ] Connect community submissions to real database (Supabase)
- [ ] Add discussion threads to verified submissions

### Month 3: Revenue
- [ ] Apply for pet insurance affiliate programs (Lemonade, Healthy Paws)
- [ ] Reach out to Dutch/Vetster for telehealth partnership
- [ ] Build symptom tracker (localStorage first)
- [ ] Publish 4-6 SEO-targeted articles from handbook chapters
- [ ] If >10K monthly visits: add Google AdSense
- [ ] Launch email newsletter (weekly bulldog skin health tips)

### Milestone Targets

| Metric | Month 1 | Month 3 | Month 6 | Month 12 |
|--------|---------|---------|---------|----------|
| Monthly visitors | 500 | 3,000 | 15,000 | 50,000 |
| Email subscribers | 50 | 300 | 1,500 | 5,000 |
| Monthly revenue | $0 | $50-200 | $500-1,500 | $3,000-10,000 |
| Community submissions | 10 | 50 | 200 | 500+ |
| Verified submissions | 5 | 25 | 100 | 250+ |

---

## Decision: What NOT to Build

- **Mobile app** — PWA is sufficient. Native app adds cost and maintenance for no SEO benefit.
- **User accounts** — Delay until community features need them. Anonymous submissions + email verification is enough initially.
- **Full CMS** — Static HTML is fine. Add Supabase only when community data needs persistence.
- **Forum software** — Don't install Discourse or similar. Start with simple comment threads on verified submissions.
- **Premium subscription** — Don't paywall content. The content IS the product that drives affiliate revenue. Gating it kills SEO.
