# NOMADLY — Delta Build Spec

**For Claude Code:** Read this file completely before writing any code. This is a delta spec — it documents only what needs to be built. Section 1 lists what already exists — do not rebuild those features. Work through sections in order. Use `PRODUCT_NAME` as a placeholder for the brand name, `placeholder@email.com` for admin email, and `// TODO: Replace with live Stripe Price ID` comments for Stripe. Confirm what exists in the codebase before writing anything new.

-----

**NOMADLY**

Claude Code — Delta Build Spec

*What to build next — based on live product audit at nomadly-kohl.vercel.app*

Confidential · March 2026 · Hand directly to Claude Code

**1. Live Product Audit — What Already Exists**

This document was created after reviewing the live product at nomadly-kohl.vercel.app. Do not rebuild anything in this section. These features exist and work.

**1.1 Already Built — Do Not Touch**

-----

**Feature**            **Status**

Quiz / Onboarding      5-step bilingual quiz. Detects PR vs US mainland, family size, income type, Spanish ancestry, timeline. Working.

Dashboard              Countdown clock, task count, document count, monthly budget widget. Working.

Visa Guides            NLV, DNV, Citizenship by Descent, Entrepreneur Visa — full detail pages with requirements, documents, timelines. Working.

Consulate Directory    Multi-country directory with map toggle. PR-specific San Juan consulate details included. Working.

Budget Tool            Cost of living, savings runway calculator, buy vs rent calculator, property price data, Spain foreign buyer rules. Working.

AI Advisor             Claude-powered chat. Working.

Document Tracker       Add/edit documents with category and status. Working (needs enhancement — see Section 3).

Task Tracker           Add/edit tasks with phase and category. Working (needs enhancement — see Section 2).

Journey / Roadmap      Phase-based roadmap. Working (needs task engine wired in — see Section 2).

Housing Search         City guides, rental platforms, rental law, market trends. Working.

Resources Database     Community-built resource list with categories. Working.

Tier Gating            Free / Wanderer / Pro gating with lock icons. Stripe checkout exists. Needs pricing update — see Section 5.

PR-Specific Content    San Juan consulate, 2-year citizenship fast track, apostille notes scattered throughout. Needs dedicated landing page — see Section 6.

Coaching Booking       $15/$49 Calendly integration. Needs pricing update — see Section 7.

Portugal Stub          'Coming Soon' placeholder. Leave as-is.

-----

**DO NOT: do not rebuild quiz, dashboard layout, visa guides, consulate directory, housing, budget calculators, or AI Advisor chat UI. They exist.**

**2. Delta Task 1 — Dynamic Task Engine**

Current state: Tasks are manually added by the user. There is no pre-populated task list, no dependency logic, and no urgency calculation tied to the move date. This is the #1 retention feature missing from the product.

Target state: When a user completes the quiz, their task list is automatically populated based on their visa type, origin, family size, and move date. Tasks have dependencies and urgency is calculated dynamically.

**2.1 Task Data Schema**

Create a tasks data file (tasks.json or equivalent) with the following structure per task:

> { id, title, description, category, visa_types[], family_types[],
> 
> origin_types[], due_offset_days, depends_on[], estimated_days,
> 
> estimated_cost_usd, how_to_steps[], official_link, pr_override? }

Field definitions:

- id — unique string, e.g. 'fbi-background-check'
- visa_types[] — which visas this task applies to: ['NLV','DNV','Entrepreneur','Student','Descent'] or ['ALL']
- family_types[] — ['solo','couple','family'] or ['ALL']
- origin_types[] — ['PR','mainland'] or ['ALL']. Use this to show PR-specific variants
- due_offset_days — negative integer. Days before move_date the task should be done. E.g. -90 = 90 days before move date
- depends_on[] — array of task IDs that must be complete before this task unlocks
- pr_override — optional object that replaces how_to_steps[] when user.origin === 'PR'

**2.2 Starter Task List to Pre-Populate**

Pre-populate these tasks at minimum. Add more over time without a code deploy — the engine reads from the data file.

-----

**Task**                       **Visa**                 **Due (days out)**    **Depends On**                   **PR Override?**

FBI Background Check           NLV, DNV, Entrepreneur   -90                   none                             Yes — PR apostille route differs

PR/State Criminal Record       ALL                      -90                   none                             Yes — PR Dept of Justice process

Apostille FBI Check            NLV, DNV, Entrepreneur   -75                   fbi-background-check             Yes — PR State Dept, not US federal

Obtain Birth Certificate       ALL                      -90                   none                             Yes — PR Registry of Vital Statistics

Apostille Birth Certificate    ALL                      -75                   obtain-birth-cert                Yes — PR process

Get Health Insurance Quote     NLV, DNV, Entrepreneur   -75                   none                             No

Book Consulate Appointment     NLV, DNV, Entrepreneur   -60                   apostille-fbi, apostille-birth   Yes — San Juan consulate

Obtain Medical Certificate     NLV                      -45                   none                             No

Prepare Document Folder        ALL                      -30                   book-consulate                   No

Attend Consulate Appointment   NLV, DNV, Entrepreneur   -21                   prepare-folder                   No

Book One-Way Flight            ALL                      -30                   none                             No — but note PR airports

Book Temporary Housing         ALL                      -21                   none                             No

Open Wise / N26 Account        ALL                      -21                   none                             No

Apply for TIE Card             ALL                      +7 (after arrival)    arrived                          No

Empadronamiento                ALL                      +14 (after arrival)   tie-card                         No

-----

**2.3 Engine Logic to Build**

- On quiz completion: filter tasks by user.visa_type, user.origin, user.family_type. Write filtered task list to user state.
- Calculate due_date per task: user.move_date + due_offset_days
- Sort tasks by due_date ascending
- Mark task as 'urgent' if due_date is within 7 days of today
- Lock tasks whose depends_on[] contains any incomplete task IDs
- On task marked complete: save state, unlock dependents, recalculate urgency, update dashboard widget counts
- Dashboard widget: read from calculated state — 'X tasks remaining · Y urgent this week'

**DO NOT: do not hardcode task lists in the UI. The engine reads from the task data file so tasks can be updated without a code deploy.**

**2.4 PR Override Behavior**

When user.origin === 'PR', the how_to_steps[] for affected tasks should display the pr_override content instead of the default. Example:

- FBI Background Check: default steps reference the US Dept of Justice Identity History Summary process. PR override: same process BUT apostille must be obtained from the US Dept of State (federal), NOT the PR Dept of State — this is a common PR user mistake. Flag it clearly.
- Apostille tasks: default references the Secretary of State of the user's US state. PR override: Apostille in PR is issued by the Puerto Rico Department of State (Estado), Office of the Secretary of State, San Juan. Processing time: 3-5 business days in person, 4-6 weeks by mail. Fee: $10 per document.
- Birth Certificate: PR override — obtain from Puerto Rico Registry of Vital Statistics (Registro Demográfico), not a US county clerk. Online orders: vitalchek.com or registrodemografico.pr.gov. Standard processing: 5-7 business days. Apostille then through PR Dept of State.
- Consulate Appointment: PR override — book at Consulado General de España en San Juan (Hato Rey), not Miami. Phone: 787-758-6090. Hours: Mon-Fri 8:30am-1:30pm. Current wait: 4-10 weeks.

**3. Delta Task 2 — Document Tracker Enhancement**

Current state: Document tracker allows manual add/edit with category and status. No pre-populated required documents, no expiry tracking, no PR-specific instructions per document.

Target state: Required documents are auto-populated based on visa type at quiz completion. Each document has step-by-step instructions, estimated cost and time, expiry tracking, and PR-specific variants.

**3.1 Document Data Schema**

> { id, name, description, why_needed, category,
> 
> required_for_visas[], required_for_origins[],
> 
> how_to_get_steps[], estimated_days, estimated_cost_usd,
> 
> apostille_required, expiry_months,
> 
> official_link, pr_override? }

**3.2 User Document Record**

> { document_id, status, obtained_date, expiry_date,
> 
> notes, has_upload, submitted_to_consulate }

Status options: 'not_started' | 'in_progress' | 'ready' | 'submitted' | 'approved'

**3.3 Required Documents to Pre-Populate**

-----

**Document**                              **Visa**         **Apostille?**    **Expires?**         **PR Variant?**

Valid Passport                            ALL              No                Yes — check date   No

Birth Certificate                         ALL              Yes               No                   Yes — PR Registry

FBI Background Check                      NLV, DNV, Ent.   Yes — federal   Yes — 6 months     Yes — apostille route

Local Criminal Record (PR/State)          ALL              Yes               Yes — 3-6 months   Yes — PR DOJ

Medical Certificate                       NLV              No                Yes — 3 months     No

Health Insurance Certificate              NLV, DNV, Ent.   No                Annual               No

Proof of Income / Bank Statements         NLV, DNV         No                Yes — 3 months     No

Employment Contract or Client Contracts   DNV              No                Check dates          No

Company Proof of Existence (1yr+)         DNV              No                No                   No

Passport Photo                            ALL              No                No                   No

NV Application Form (EX-01)               NLV              No                No                   No

Marriage Certificate                      Couple/Family    Yes               No                   Yes — if PR-issued

Children's Birth Certificates            Family           Yes               No                   Yes — PR Registry

-----

**3.4 Behavior Changes**

- On quiz completion: auto-populate document tracker with documents required for user.visa_type and user.family_type. User sees them with status 'not_started' — they do not need to add them manually.
- Each document row expands to show: what it is, why it's needed, how to get it (steps), estimated time + cost, PR-specific note if user.origin === 'PR'.
- Expiry warning: if expiry_months is set and obtained_date is recorded, calculate expiry_date and surface a warning banner when expiry_date is within 30 days.
- FBI check expiry is especially important — it expires 6 months from issue. If a user obtains it early and their move date slips, they may need to reorder.

**DO NOT: do not remove the manual 'Add Document' button — users may have additional documents not in the pre-populated list.**

**4. Delta Task 3 — Legal Disclaimer System**

This must be completed before any paying user accesses visa content. It is not optional.

**4.1 Onboarding Acknowledgment Screen**

Show once, after quiz completion, before user sees their dashboard for the first time. Store acknowledged: true in user state. Cannot be skipped.

Exact copy to display:

> *"Nomadly provides educational information to help you prepare for your move to Spain. We are not a law firm and do not provide legal, immigration, or financial advice. Visa requirements change frequently and individual circumstances vary. By continuing, you confirm that you understand this platform is for informational and planning purposes only, and that you will verify all requirements with the official Spanish consulate or a licensed immigration professional before submitting any application."*

Button: [I Understand — Take Me to My Plan]

*NOTE: This is a modal/full-screen overlay, not a checkbox. The user must actively click to proceed.*

**4.2 AI Advisor — Auto-Appended Disclaimer**

Append to every AI Advisor response automatically in the UI layer, below the response text. Do not ask Claude to include it — append it in the frontend render:

> *"For educational purposes only. Not legal or immigration advice. Requirements change — verify with the official Spanish consulate or a licensed attorney before proceeding."*

**4.3 Visa Content Pages — Persistent Banner**

Add a non-dismissible banner at the top of every visa guide page. Suggested copy:

> *"Educational guide only — not legal advice. Requirements change. Always verify at the official Spanish consulate website before submitting documents."*

Follow with a small link: [Official Source: exteriores.gob.es ↗]

**4.4 Terms of Service — Required Clause**

Ensure Terms of Service includes the following language (add if not present):

- Nomadly does not guarantee visa approval and is not responsible for visa denials, delays, or changes in immigration policy.
- Use of this platform does not constitute immigration legal advice or representation.
- Subscription fees are non-refundable after the 7-day trial period.
- Content is provided for educational and informational purposes only.

**5. Delta Task 4 — Pricing Update**

Current pricing ($9/$19) undervalues the product. The closest competing service charges $750 for a static package (videos + Slack + Google Doc). Nomadly is dynamic, bilingual, AI-powered, and updates automatically. Update all pricing references in the codebase and Stripe products.

**5.1 New Pricing Structure**

-----

**Tier**        **Monthly**   **Annual**   **Annual/mo**   **What it covers**

Free            $0           $0          —             Quiz, Phase 1 preview, consulate directory, visa overviews

**Wanderer**    $29          $229/yr     $19/mo         Full guides, task tracker, document tracker, budget tools, city data, housing search, resources — Spain only

**Nomad Pro**   $59          $449/yr     $37/mo         Everything in Wanderer + AI Advisor, roadmap PDF, smart document packs, Pro calculators, Portugal content when live

**Partner**     $99          $799/yr     $67/mo         Attorney/advisor accounts. Client dashboard, invite links, co-branding, up to 20 client seats. See Section 8.

-----

**5.2 Annual Pricing — Push Hard at Checkout**

- At checkout: default to Annual tab, not Monthly. Annual saves 35% — show the monthly equivalent prominently: '$19/mo billed annually'.
- On the pricing comparison table in the app: show annual as 'Most Popular' toggle, not monthly.
- After free trial ends: email prompt should lead with annual pricing offer.

**5.3 Stripe Updates Required**

- Create new Stripe products: Wanderer Monthly ($29), Wanderer Annual ($229), Pro Monthly ($59), Pro Annual ($449), Partner Monthly ($99), Partner Annual ($799)
- Archive old products ($9/$19) — do not delete, keep for any existing subscribers
- Update all price IDs referenced in the codebase to new Stripe price IDs
- Update checkout copy: trial period remains 7 days. After trial: 'You will be charged $[price] on [date].'

**DO NOT: do not change the Free tier. Keep it exactly as-is.**

**5.4 Pricing Page Copy Updates**

Update the feature comparison table to reflect new tier names and prices. Update any hardcoded price strings throughout the app. Search codebase for '$9', '$19', '9/mo', '19/mo' and replace all instances.

**6. Delta Task 5 — Puerto Rico Dedicated Landing Page**

Create a dedicated landing page at /puerto-rico (or /pr). This is a marketing page — not a separate product. It surfaces what's already in the app but speaks directly to PR residents and makes the PR-specific differences immediately clear.

**6.1 Page URL**

> nomadly.app/puerto-rico

Also add a nav link or footer link to this page visible to all users. When a quiz user selects 'Puerto Rico' as their origin, show a subtle banner on their dashboard: 'We've customized your plan for Puerto Rico residents. [See what's different →]' linking to this page.

**6.2 Page Structure**

**Hero Section**

- Headline: 'Moving to Spain from Puerto Rico? Your process is different — and we've built for it.'
- Subheadline: 'Bilingual guides, PR-specific document instructions, and the only platform that knows you don't go through Miami.'
- CTA: [Take the Free Quiz →] — same quiz, but pre-selects Puerto Rico origin

**Key Differences Section**

This is the core of the page. A clear, scannable breakdown of how PR differs from mainland US:

-----

**Step**                **Mainland US**                              **Puerto Rico (Your Route)**

Apostille Authority     Secretary of State of your US state          Puerto Rico Department of State — San Juan

Birth Certificate       County Clerk or state vital records          Registro Demográfico de Puerto Rico

Consulate Appointment   Miami, Houston, or LA (depending on state)   Consulado General de España — Hato Rey, San Juan. No travel required.

Language                Translation required for all Spanish docs    Already Spanish-fluent. Fewer translation costs.

Citizenship Timeline    10 years as standard US citizen              2 years as Iberoamericano. Fastest path in the EU.

Cultural Fit            Major adjustment                             Language, food, pace of life — familiar. Transition is smoother.

-----

**PR-Specific Resources Section**

- Consulado General de España en Puerto Rico — address, phone, hours, appointment link, current wait times
- Puerto Rico Department of State — apostille process and fee ($10/doc)
- Registro Demográfico — birth certificate order links
- PR Department of Justice — local criminal record process
- Sworn translator (traductor jurado) directory — Spain-accredited translators in Puerto Rico

**Social Proof / Community Section**

Placeholder for testimonials from PR users once you have them. For launch: use a simple 'Join [X] Puerto Ricans planning their move to Spain' counter pulled from user count with origin === 'PR'.

**CTA — Bottom of Page**

- Primary: [Start Your Free Plan →] — links to quiz with PR pre-selected
- Secondary: [Book a 20-Minute Call →] — links to coaching booking

**6.3 Quiz Pre-Selection**

When a user arrives via /puerto-rico URL, pre-select 'Puerto Rico' on Step 1 of the quiz. User can still change it. Implement via URL param: /quiz?origin=PR

**7. Delta Task 6 — Coaching Offer Update**

Current: $15 intro (15 min), $49 deep dive (60 min) via Calendly. Update pricing and scope. This remains a short-term offer — phase out or hand to partner attorneys once the partner program is live.

**7.1 New Coaching Pricing**

-----

**Session**          **Duration**   **Price**       **What it covers**

Intro Call           20 min         $45            Is this move right for me? Product walkthrough + general questions. Not legal advice.

Strategy Deep Dive   60 min         $149           Full visa strategy review, document checklist review, timeline planning. Not legal advice.

-----

**7.2 Required Disclaimer on Booking Page**

Add directly above the booking button on both session types:

> *"These sessions provide general relocation guidance and product support — not legal, immigration, or financial advice. For visa-specific legal questions, please consult a licensed immigration attorney."*

**7.3 Coaching Copy Updates**

- Update all references from '$15' to '$45' and '$49' to '$149' throughout the app
- Update session duration from '15 min' to '20 min' for the intro call
- Keep the coach bio copy as-is — authenticity is valuable. The PR relocation story is a trust signal.
- Add the legal disclaimer above (7.2) to the booking modal and the coaching section on the sidebar

**8. Delta Task 7 — Partner / B2B Model (Phase 2)**

Build this after Tasks 1-6 are complete and the first paying consumer users are onboard. Do not block launch on this. Target: Month 2.

**8.1 What the Partner Model Is**

Immigration attorneys, gestorías, financial advisors, and relocation consultants pay a monthly fee for a Partner account. They invite their clients into Nomadly. Their clients get Pro-equivalent access. The partner gets a dashboard to monitor client progress and co-brand the experience. No custom contracts required — partners agree to Partner ToS at signup.

**8.2 Partner Tiers**

-----

**Tier**   **Monthly**   **Client Seats**   **Features**

Starter    $99          Up to 5            Partner dashboard, client invite link, co-branding (logo + welcome message), clients get Pro access

Growth     $199         Up to 20           Everything in Starter + client progress visibility, featured listing in attorney directory, priority support

Agency     $399         Unlimited          Everything in Growth + white-label subdomain, custom welcome flow, quarterly usage report

-----

*NOTE: Launch Starter and Growth only. Build Agency tier (subdomain/white-label) only when demand is proven.*

**8.3 Partner Dashboard — Build Spec**

**Partner Signup Flow**

- Separate from consumer signup. Fields: business name, role (Attorney / Gestoría / Financial Advisor / Relocation Consultant), country of practice, website, agree to Partner ToS
- After signup: partner lands on their partner dashboard, not the consumer dashboard

**Partner Dashboard Features**

- Client list: name, visa type, journey phase (Preparing / Applying / Approved / Arrived), move date, last active date
- Invite client: generate unique invite link OR enter client email → client receives branded welcome email → client completes quiz → client gets Pro access
- Co-branding settings: upload logo, set welcome message (appears on client's onboarding screen after quiz)
- Seat management: deactivate a client seat and reassign to a new client
- Billing: partner billed separately from consumer users. Use Stripe, separate product IDs

**Client Experience (Partner-Invited)**

- Email subject: '[Firm Name] has set up your Spain relocation guide'
- Email body: 'Your attorney/advisor has set up a personalized relocation plan for you. Click below to get started.' → [Start My Plan →]
- Client lands on quiz with a co-branded header showing firm logo
- Client dashboard shows '[Firm Name] x [Product Name]' co-branded header
- Client can upgrade their own account if the partner relationship ends

**Attorney Directory**

- Add a directory section to the Resources tab. Fields: name, firm, specialization, languages, countries, fee range, contact link, verified partner badge
- Any professional can request a free listing. Partners get a 'Verified Partner' badge automatically
- Curate manually at launch — start with 5-10 attorneys and gestorías who specialize in Spanish visas

**8.4 First Partner Outreach Script**

Use this exact pitch when reaching out to attorneys via LinkedIn or email:

> *"Hi [Name], I've built a self-guided relocation platform for people moving to Spain from the US and Puerto Rico — think of it as the tool your clients wish they had before they came to you. I'm looking for 3-5 attorney partners for a free 90-day pilot where you invite clients and they get a Pro account. No cost to you, no contracts — just your feedback and a testimonial if you find it useful. Happy to do a 20-minute walkthrough if you're curious."*

*NOTE: Do not charge partners in Month 1. Get 3 pilot partners, get feedback, get testimonials. Start billing in Month 2.*

**9. Delta Task 8 — Contextual Upgrade Triggers**

Current state: Upgrade prompts exist as generic lock icons. Target state: upgrade prompts are contextual, triggered by specific user actions, and personalized to the user's visa type and destination.

**9.1 Trigger Rules**

*NOTE: Never show more than one upgrade prompt per session. Do not interrupt active task flows.*

-----

**Trigger**                                 **User State**               **Modal Copy**

Quiz completed, Free user                   Any                          'Your [Visa Type] plan for [City] is ready. Unlock your full roadmap, task list, and document tracker.' → [Unlock Wanderer — $29/mo]

Wanderer user opens AI Advisor              Wanderer                     'AI Advisor is included in Pro. Upgrade to ask anything about your move — available 24/7.' → [Upgrade to Pro — $59/mo]

Wanderer user marks application Submitted   Wanderer, post-application   'Application submitted — the waiting begins. Pro includes your post-approval checklist, arrival guide for [City], and AI Advisor while you wait.' → [Upgrade to Pro]

Wanderer user move_date within 90 days      Wanderer, <90 days out      'You're [X] days from your move. Your arrival checklist and first-week guide for [City] are in Pro.' → [Upgrade to Pro]

Free user tries to open document tracker    Free                         Blur overlay: 'Track all [X] documents required for your [Visa Type] — unlock with Wanderer.' → [Start Free Trial]

-----

**DO NOT: never show a generic 'Upgrade' button without context. All upgrade prompts must reference the user's specific visa type, destination city, or current journey phase.**

**10. 90-Day Launch Checklist**

Sequence: Legal and business setup runs in parallel with product. Marketing starts Week 3 — not after launch.

**WEEK 1 — FOUNDATION (DO THIS FIRST)**

**Business & Legal**

- Finalize brand name — run USPTO search at tmsearch.uspto.gov (Class 42, Class 39). Decide within 48 hours.
- Secure domain (.com) immediately after name decision — Namecheap or Porkbun
- Register LLC in Puerto Rico — PR Dept of State online portal, $100-150 filing fee
- File USPTO trademark Intent-to-Use (Class 42) at trademarkcenter.uspto.gov — $350. File before any public announcement.
- Open business bank account — Mercury or Relay (both work for PR LLCs, online setup)
- Schedule Act 60 tax consultation — before your July move to Málaga. Decree must be filed while still PR resident.
- Update Stripe products with new pricing (Section 5) — archive old $9/$19 products
- Update Terms of Service with visa denial / no-legal-advice clauses (Section 4.4)

**WEEK 2 — PRODUCT (CLAUDE CODE)**

**Build Priority Order**

- Task 3 first: Onboarding acknowledgment screen + AI Advisor disclaimer + visa page banner (Section 4). Required before any paying user accesses visa content.
- Task 4: Pricing update — update all price strings, Stripe IDs, pricing page copy (Section 5)
- Task 6: Coaching pricing update — $45/20min, $149/60min, add disclaimer (Section 7)
- Task 1: Dynamic task engine — build schema, populate starter task list, wire to quiz output (Section 2)
- Task 2: Document tracker enhancement — auto-populate on quiz completion, add PR overrides (Section 3)

**WEEK 3 — SOFT LAUNCH**

**First Users**

- Share in your existing PR/Latino community groups — frame as 'I built this for people like us, would love feedback'
- DM 10-15 people in your network who are considering or have considered moving to Spain — personal outreach only
- Set up a simple feedback form (Tally or Typeform) and send to early users — 5 questions max
- Task 5: Build /puerto-rico landing page (Section 6) — this is your primary organic acquisition page
- Reach out to 3 immigration attorneys for pilot partner program — use script in Section 8.4

**WEEK 4–6 — ITERATE**

**Based on First Users**

- Review feedback — what are people confused by? What tasks are they doing first? Where do they drop off?
- Task 8: Implement contextual upgrade triggers based on what you observe (Section 9)
- Add 3-5 attorneys / gestorías to Resources directory — reach out directly, offer free listing
- Start email sequence for users who completed quiz but did not upgrade — 3-email drip: Day 1, Day 4, Day 10

**MONTH 2–3 — REVENUE & PARTNERS**

**Scale**

- Task 7: Build partner dashboard (Section 8) — start with Starter tier only
- Onboard first 3 paying partner accounts — use 90-day pilot feedback to refine
- Annual plan push — add email prompt at Day 30 offering annual upgrade at 35% discount
- Begin Act 60 decree application if not already filed — requires physical PR presence
- Review pricing — if conversion rate is above 8%, you may have room to test higher

**One rule above all: complete the legal disclaimer system (Task 3) before any paid user accesses visa content. Everything else can be iterated. This cannot.**
