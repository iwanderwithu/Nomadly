# NOMADLY — Final Build & Launch Spec

**For Claude Code:** Read this file completely before writing any code. This covers: i18n/Spanish translation, homepage redesign, testing mode, PWA, full marketing plan, and business advisor notes. Implement sections in order. Use `PRODUCT_NAME` as placeholder for brand name everywhere.

-----

**NOMADLY**

Final Build & Launch Spec

*i18n · PWA · Homepage · Country Expansion · Testing · Full Marketing Plan*

Confidential · March 2026 · Hand directly to Claude Code

**1. Full i18n — Spanish Translation & Multi-Language Architecture**

The EN/ES toggle exists and works for most content. This section ensures every string in the product is translatable, nothing is hardcoded in English only, and adding a third language (Portuguese for Portugal expansion) requires only a new translation file — no code changes.

**1.1 Audit — What Claude Code Must Scan**

Search the entire codebase for hardcoded English strings. Check every one of the following:

- All button labels — 'Start Free Trial', 'Unlock', 'Continue', 'Cancel', 'Save', 'Add Task', etc.
- All error messages — form validation, API errors, empty states
- All tooltip and helper text
- All email templates — welcome email, trial ending, upgrade prompts, partner invite
- All onboarding copy — quiz labels, quiz answer options, quiz results screen
- All legal disclaimers — onboarding acknowledgment, AI Advisor footer, visa page banner
- All dashboard widget labels — 'Tasks Remaining', 'Documents Ready', 'Monthly Budget', 'urgent this week'
- All empty state messages — 'No tasks yet', 'No documents added', etc.
- All notification and alert copy
- All pricing page copy — tier names, feature descriptions, CTA buttons
- All coaching booking copy

**DO NOT: do not leave any user-facing string hardcoded in English. Every string must reference a translation key.**

**1.2 i18n Architecture**

If not already using an i18n library, implement one now. Recommended: i18next (works with React/Next.js). Structure:

> locales/
> 
> en/
> 
> common.json — buttons, labels, navigation
> 
> dashboard.json — dashboard widgets and copy
> 
> quiz.json — all quiz content
> 
> visa.json — visa guide content
> 
> legal.json — all disclaimer copy
> 
> email.json — email template strings
> 
> errors.json — all error and empty state messages
> 
> es/
> 
> common.json — Spanish equivalents
> 
> [same structure]
> 
> pt/ — empty for now, add when Portugal launches

*NOTE: Keeping translation files in this structure means adding Portuguese is a content task, not a development task. Create the /pt folder when Portugal content is ready.*

**1.3 Spanish Quality Check**

The existing Spanish translations should be reviewed for tone and naturalness — machine-translated strings often feel stiff. Specific areas to review:

- Quiz answer options — these should feel conversational, not formal. Use 'tú' form throughout, not 'usted'.
- Dashboard greeting — 'Good morning' in Spanish should be 'Buenos días' with the same warm tone as English.
- Legal disclaimers — must be legally clear but not robotic. Have a native Spanish speaker review.
- Visa guide content — already in good shape based on live audit. Spot-check technical terms: 'apostillar', 'traductor jurado', 'empadronamiento' are already correct.
- Error messages — these are often forgotten in translations. Check every validation and error state.

**TIP: use DeepL (not Google Translate) for any new strings that need translation — significantly better quality for Spanish.**

**1.4 Language Toggle Behavior**

- Language preference should be saved to user state — if a user sets ES, they should see ES on every subsequent visit without re-toggling.
- Language preference should also apply to emails — if user language is ES, all system emails send in Spanish.
- Default language: EN. If browser language is Spanish (navigator.language starts with 'es'), offer a one-time prompt: 'Cambiar a español?' with a single click to switch. Do not auto-switch without user consent.
- The /puerto-rico landing page should default to bilingual — Spanish headline with English subtitle, or a true 50/50 layout. PR users are bilingual and will feel seen by both languages present.

**1.5 Country Expansion — Architecture Requirement**

This is the most important architectural decision for the product's future. Make it now, before adding more country content.

- Every visa, task, document, city, cost, and guide must be tied to a destination_country field — never hardcoded as 'Spain'.
- Data structure: all country-specific content lives in country config files. Example:

> countries/
> 
> es.json — Spain: visas, tasks, documents, cities, costs, consulates
> 
> pt.json — Portugal: same structure, populate when ready
> 
> it.json — Italy: stub for future

- The app reads destination_country from user.destination_country set during quiz. All content filters accordingly.
- The quiz 'Where do you want to move?' question already shows Portugal as 'Coming Soon' — this is correct. When Portugal data is ready, flip its status to active and populate pt.json. No code changes needed.

**DO NOT: do not hardcode 'Spain' anywhere in the codebase — not in component names, not in copy, not in data keys. Use destination_country variable everywhere.**

**2. Homepage Redesign — Marketing Page vs. Portal**

Current state: The product header sits at the top of the dashboard, blurring the line between the public marketing page and the logged-in portal. New visitors don't get a proper introduction — they land inside the tool without understanding what it is or why it matters.

Target state: Two distinct experiences — a warm, emotional marketing homepage for visitors, and a clean dashboard portal for logged-in users. The homepage tells the story. The portal delivers the product.

**2.1 The Problem to Solve**

- A visitor arriving at the homepage should feel: 'This was made for me. I finally have a guide that understands my situation.'
- Currently they arrive mid-product, which is disorienting if they haven't signed up yet.
- The quiz CTA exists at the top but there's no emotional context before it — no story, no social proof, no clear value proposition for a cold visitor.

**2.2 New Homepage Structure**

Build a dedicated marketing homepage. The portal remains at /dashboard or /app (logged-in users are redirected there automatically). The homepage is for everyone else.

**Section 1 — Hero**

- Full-screen hero. Dark warm background (the current dark green/charcoal works well). Large headline.
- Headline EN: 'Your move to Spain, made simple.' (already exists — keep it)
- Headline ES: 'Tu mudanza a España, simplificada.'
- Subheadline: 'The only bilingual relocation platform built for Puerto Ricans and US citizens — with step-by-step guides, visa tracking, and an AI advisor that answers at 2am.'
- Two CTAs: [Take the Free Quiz →] (primary, brand orange) and [Browse Visas] (secondary, outlined)
- Below CTAs: the 3 stats bar — '2 min quiz', '5 visas tracked', '2 years PR → citizenship'. Keep this.

*NOTE: The hero image or background should feel warm and aspirational — a sun-lit Spanish street, a terrace with a Mediterranean view, or an abstract warm texture. Not stock-photo generic. Commission or source a high-quality image that feels authentic to the experience.*

**Section 2 — The Problem (Emotional Hook)**

- Headline: 'Moving to Spain is one of the best decisions you will ever make. The paperwork almost stopped us.'
- 3-column layout with pain points your user recognizes:
- **Column 1:** 'Conflicting information online — every blog says something different'
- **Column 2:** 'Consulate websites are in Spanish, requirements change without notice'
- **Column 3:** 'Relocation services charge $750+ for a Google Drive folder and some videos'
- Below: 'We built what we wished existed.' — simple, human, no corporate voice.

**Section 3 — What Nomadly Does (Value, Not Features)**

- Headline: 'Everything you need, in the right order, personalized to your situation.'
- 4 benefit blocks with icons — not feature lists:
- 'Your visa, matched in 2 minutes' — Quiz identifies your exact path
- 'Never miss a deadline' — Dynamic task list tied to your move date
- 'Documents done right the first time' — Step-by-step tracker with PR-specific instructions
- 'Ask anything, anytime' — AI Advisor available at 2am when anxiety peaks

**Section 4 — Puerto Rico Callout**

- A warm, distinct section — slightly different background color — specifically for PR users.
- Headline: 'Boricua? Tu proceso es diferente — y lo sabemos.'
- 3 key differences: San Juan consulate (no Miami trip), PR apostille process, 2-year citizenship fast track
- CTA: [Ver la guía para Puerto Rico →] — links to /puerto-rico landing page

**Section 5 — What's Included (Bilingual Comparison)**

- Simple comparison: Nomadly vs. hiring a relocation consultant vs. going it alone
- Highlight: bilingual (EN/ES), AI-powered, country-architecture ready, built by someone who did it

**Section 6 — Pricing Preview**

- Simple 3-column pricing cards — Free, Wanderer, Pro — with the key features and price
- Annual toggle visible and defaulted to ON — show the monthly equivalent
- CTA on each card leads to quiz first, not directly to checkout

**Section 7 — Footer**

- Links: About, Pricing, Puerto Rico Guide, Visa Guides, Resources, Contact
- Language toggle in footer as well
- Legal: Terms of Service, Privacy Policy, Educational disclaimer one-liner
- Social: Instagram, TikTok (when active)

**2.3 Portal Separation**

- Logged-in users who visit the homepage URL should be auto-redirected to /dashboard
- Logged-out users who try to access /dashboard should be redirected to homepage with a 'Sign in to continue' prompt
- The quiz is accessible from the homepage without logging in — quiz completion triggers account creation

**DO NOT: do not remove the quiz from the top of the homepage. Keep it as the primary CTA. The redesign adds context around it, not replaces it.**

**2.4 Tone & Visual Direction**

- Warm, not clinical. Mediterranean warmth — terracotta, olive, warm white, the brand orange.
- Human, not corporate. First-person voice: 'We built this because we needed it.'
- Bilingual by design — not just translated. Spanish appears naturally in headlines and section labels, not only when the toggle is switched.
- Mobile-first — the majority of your users will discover this on their phones, likely in a Facebook group or Instagram story.

**3. Testing Mode — View All Tiers**

You need to be able to see exactly what a Free user, Wanderer user, and Pro user sees — without switching accounts or paying. Build a testing mode that lets you toggle between tier views instantly.

**3.1 Admin / Test Toggle**

Add a hidden testing panel accessible only to your account (identified by your admin email address). Options:

- A floating badge in the bottom corner when logged in as admin — clicking opens the tier switcher
- Or: a URL param — /dashboard?preview=free, /dashboard?preview=wanderer, /dashboard?preview=pro
- The toggle overrides the user's actual subscription tier for display purposes only — it does not change their Stripe subscription
- A visible banner appears when in preview mode: 'PREVIEW MODE — Viewing as [Tier] user. Your actual plan is [Plan].'

**3.2 What Each Tier Should Show**

-----

**Tier**               **What the user sees**

Free                   Quiz complete, dashboard visible, Phase 1 preview only. All trackers blurred with upgrade prompt. No AI Advisor. Consulate directory and visa overviews accessible.

Wanderer               Full task tracker (pre-populated), document tracker (pre-populated), budget tools, city guides, housing search, visa guides. AI Advisor locked. Post-approval content locked.

Pro                    Everything unlocked. AI Advisor active. Post-arrival content visible. Portugal stub visible. Roadmap PDF available. Pro calculators unlocked.

Partner                Partner dashboard view — client list, invite link, co-branding settings. No consumer dashboard.

-----

**3.3 Implementation**

- Store admin emails in an environment variable: ADMIN_EMAILS='youremail@domain.com'
- On login: if user.email is in ADMIN_EMAILS, set isAdmin: true in session
- If isAdmin: true, render the floating preview toggle in the UI
- Preview state stored in React state or URL param — never persisted to database

**DO NOT: do not expose the admin toggle to non-admin users. Check isAdmin server-side, not just client-side.**

**4. Progressive Web App (PWA) — Mobile Experience**

A PWA is a website that behaves like a native app. Users visit your site on their phone and can 'Add to Home Screen' — it installs as an icon, loads instantly, and can work offline for cached content. No App Store submission, no Apple/Google approval, free to deploy. This is the right move for launch. Native iOS/Android app comes later when you have users and a finalized name and logo.

**4.1 What PWA Gives You**

- Home screen icon — users install it like an app without going to the App Store
- Full-screen mode — no browser chrome, feels native
- Offline support — cached content (visa guides, their task list, documents) available without internet
- Push notifications — send task reminders and deadline alerts to mobile (browser permission required)
- Fast load — service worker caches assets, feels instant on return visits
- No 30% App Store cut — Stripe payments go directly to you

*NOTE: When you have a finalized name and logo, submitting to the App Store is straightforward and adds discoverability. Do it in Month 2-3. PWA gets you mobile-ready at launch.*

**4.2 PWA Implementation for Claude Code**

- Add a Web App Manifest file (manifest.json) to the project root:

> {
> 
> "name": "[Product Name]",
> 
> "short_name": "[Short Name]",
> 
> "description": "Self-guided relocation to Spain",
> 
> "start_url": "/",
> 
> "display": "standalone",
> 
> "background_color": "#1A2B2B",
> 
> "theme_color": "#C0622B",
> 
> "icons": [
> 
> { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
> 
> { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
> 
> ]
> 
> }

- Add a Service Worker that caches: visa guide pages, the user's dashboard data, task and document lists
- Add an 'Install App' prompt — show once after the user has visited twice. 'Add Nomadly to your home screen for quick access.' Dismiss stores preference.
- Icons: you need a 192x192 and 512x512 PNG version of your logo. This is another reason to finalize the name and logo — you cannot complete the PWA without them.
- If using Next.js: use the next-pwa package — it handles service worker and manifest automatically.

**4.3 Mobile UX Priorities**

The dashboard was built desktop-first. Before PWA launch, review these mobile-specific issues:

- The sidebar navigation — on mobile this should collapse into a bottom tab bar (Overview, Journey, Budget, AI, More)
- The quiz — test on mobile, ensure each step is full-screen and tap targets are large enough
- The document tracker — expanding document rows on mobile should be smooth, not cramped
- The AI Advisor — text input on mobile should not be covered by the keyboard when typing
- The pricing page — tier cards should stack vertically on mobile, not collapse into unreadable columns

**4.4 What to Build for the 'Most Important Info at Fingertips' App**

You asked whether there should be a simplified mobile app with just the essential info. The answer is: yes, but via the PWA, not a separate product. The mobile view of the PWA should surface a simplified 'Today' view as the default mobile dashboard:

- Top: countdown — 'X days to your move'
- Middle: 3 urgent tasks this week — tappable, mark complete inline
- Middle: document status — X/Y ready, tap to open tracker
- Bottom: quick access — AI Advisor, Visa Guide, Consulate Info
- The full desktop dashboard remains accessible via the sidebar — the mobile view is just a focused entry point

*NOTE: This is not a separate product. It is a responsive mobile layout of the existing dashboard that prioritizes the most time-sensitive information.*

**5. Full Marketing Plan — 90 Days to First Paying Users**

You have three channels: community (Facebook groups, WhatsApp, Reddit), social (Instagram, TikTok), and SEO (Google search). Each plays a different role. Community gets you first users fast. Social builds brand over time. SEO compounds quietly and becomes your biggest channel by Month 6.

**5.1 Your Competitive Advantages to Lead With**

These are your marketing angles — every piece of content, every group post, every caption should connect back to one of these:

-----

**Advantage**               **How to say it in marketing**

Fully bilingual EN/ES       'The only Spain relocation platform available in English and Spanish — built for people who think in both.'

PR-specific content         'If you're from Puerto Rico, your process is different. We're the only platform that knows that.'

AI Advisor                  'Ask anything about your move at 2am. No appointment, no attorney fee, no waiting.'

Dynamic task engine         'Your move date, your visa, your checklist — updated automatically, not a static PDF.'

Price vs. competitors       'Relocation services charge $750 for a Google Drive folder. We charge $29/month for a platform that updates when requirements change.'

Built by someone doing it   'Built by a Puerto Rican who navigated this process alone. Every feature exists because it was needed.'

-----

**5.2 Phase 1 — Community Launch (Weeks 1-3)**

This is your fastest path to first users. You are already in the groups where your users live. Use that.

**Facebook Groups to Target**

- Americans / Expats in Spain — multiple groups, 10k-50k members each
- Living in Malaga / Sevilla / Madrid / Valencia — city-specific groups
- Puerto Ricans in Spain / Europa
- Non-Lucrative Visa Spain / DNV Spain groups
- Boricuas en el Exterior
- Spain Relocation / Moving to Spain groups

**How to Post (Not Spam)**

Do not post 'check out my product.' Post as a person who built a solution to a problem they had. Example post:

> *"I moved from Puerto Rico and spent months piecing together visa info from 40 different websites, Facebook threads, and YouTube videos. Half of it was wrong or outdated. I ended up building the tool I wish existed — a bilingual step-by-step relocation platform specifically for people moving from PR and the US to Spain. It's free to start (takes 2 minutes to get your personalized plan). If you're in the planning phase, I'd genuinely love your feedback. [link]"*

- Post variations in different groups — change the opening, keep the authenticity
- Reply to every comment personally for the first 30 days — this is your user research and your word-of-mouth engine
- In Spanish-language groups, post in Spanish. Use the PR-specific angle for PR groups.

**WhatsApp / Telegram Groups**

- Many Spain relocation communities have WhatsApp groups. Join them. Share when someone asks a question you can answer — then mention the platform naturally.
- Do not drop links without context. Answer the question first, mention the tool second.

**Reddit**

- r/expats, r/digitalnomad, r/SpainExpats, r/movingtospain
- Same approach — answer questions genuinely, mention the platform when relevant
- Do not post promotional content to Reddit. It will be removed and you will be banned.

**5.3 Phase 2 — Instagram & TikTok (Weeks 3-12)**

Your IG handle (iwanderwithu) already has an audience and a voice. The content strategy is simple: document the process you're going through, teach what you know, and let the product be the natural conclusion.

**Content Pillars (rotate between these)**

-----

**Pillar**          **Example Content**                                                                                      **Frequency**

Education           '5 things nobody tells you about the NLV' / 'The apostille mistake PR people make'                   3x per week

Behind the scenes   'Building a relocation platform from Puerto Rico' / 'What I learned from my consulate appointment'   1x per week

Community           'DM me your biggest Spain question' / polls, Q&A                                                       2x per week

Product             Screen recordings of the platform, 'watch me plan my move in 10 minutes'                               1x per week

Spanish-language    Same content in Spanish — not dubbed, re-recorded naturally                                            2x per week

-----

**Posting Strategy**

- Instagram Reels and TikTok are the same content — film once, post to both
- Caption in both English and Spanish — not full translation, just bilingual flow. Example: 'Moving to Spain? Here is what they don't tell you about the apostille process. / ¿Mudándote a España? Esto es lo que nadie te dice...'
- Link in bio: your product URL. Instagram: use a Linktree or equivalent with your product, /puerto-rico page, and coaching booking
- Stories: daily during active moving prep. Polls, questions, countdowns. This is where community builds.
- Do not buy followers or engagement. Organic only — the audience you build this way converts. Bought followers do not.

**Content Ideas for First 30 Days**

- 'I'm moving from Puerto Rico to Spain in [X] days — follow along'
- 'The 5 visas to move to Spain — which one is yours?' (carousel)
- 'Puerto Rico to Spain: your consulate is in San Juan, not Miami' (this will go viral in the PR community)
- 'I built a relocation platform because I was lost — here's what it does' (screen recording)
- 'The document that expires in 6 months and most people order too early' (FBI background check)
- 'How I'm planning my move to Malaga in 10 minutes' (product walkthrough)

**5.4 Phase 3 — SEO & Blog (Month 1 onward, compounds over time)**

SEO is slow but it becomes your largest channel by Month 6. Every blog post is a permanent asset that brings organic traffic while you sleep.

**Target Keywords (High Intent, Low Competition)**

- 'how to move to spain from puerto rico'
- 'spain non lucrative visa requirements 2026'
- 'digital nomad visa spain from us'
- 'apostille process puerto rico for spain visa'
- 'spain consulate san juan puerto rico appointment'
- 'moving to malaga from united states'
- 'spain citizenship 2 years iberoamerican'
- 'beckham law spain digital nomad'

**Blog Structure**

- Write one long-form guide per week. 1,500-3,000 words. Answer the question completely — do not tease.
- Each guide ends with: 'Planning your move? Get your personalized Spain relocation plan in 2 minutes.' → CTA to quiz
- Translate your top 5 posts to Spanish — these rank separately in Spanish-language Google searches
- Internal linking: every blog post links to the relevant visa guide inside the product

**SEO Technical Requirements for Claude Code**

- Every page needs: unique title tag, meta description, Open Graph image (for social sharing)
- The /puerto-rico page needs full SEO optimization — this is your highest-converting organic page
- Visa guide pages should be indexable by Google — check that they are not behind a login wall. The overview should be public; the full guide can be locked.
- Add a sitemap.xml and robots.txt
- Page speed: run Lighthouse on the homepage. Score should be 90+ on mobile. Slow pages do not rank.

**5.5 Launch Day Sequence**

When you are ready to publicly launch — after legal disclaimers are in, pricing is updated, and testing mode is confirmed — do this in order:

- Post in 5 Facebook groups simultaneously — stagger by 2 hours
- Post launch Reel on Instagram and TikTok — 'It's live. Here's what I built and why.'
- Send to your personal network via WhatsApp — 'I built something, would love your eyes on it'
- Post on LinkedIn — professional angle, reach employers and remote workers
- Post on Reddit (r/SpainExpats, r/expats) — answer a question, mention the tool
- Email any attorneys or advisors you've contacted — 'It's live, here's your partner link'
- DM your IG followers who have engaged with Spain/travel content — personal outreach, not broadcast

**5.6 Marketing Copy — Bilingual Taglines**

Use these across all channels:

-----

**English**                                               **Spanish**

'Your move to Spain, made simple.'                      'Tu mudanza a España, simplificada.'

'The bilingual relocation platform built for us.'       'La plataforma bilingüe hecha para nuestra comunidad.'

'From Puerto Rico to Spain — we know your process.'   'De Puerto Rico a España — conocemos tu proceso.'

'More than a guide. A plan that moves with you.'        'Más que una guía. Un plan que avanza contigo.'

'Ask anything. 2am included.'                           'Pregunta lo que sea. Las 2am incluidas.'

-----

**6. Business Advisor — What Else Needs to Happen**

Acting as your digital product and business advisor: here is everything not yet addressed that could determine whether this succeeds or stalls in 90 days.

**6.1 Name & Logo — The Blocker**

Nothing else in this document can be fully completed without a finalized name and logo. The PWA manifest needs a name. The App Store submission needs a name. The trademark filing needs a name. The domain needs a name. The Instagram bio needs a name.

- Decision deadline: within 7 days of reading this document.
- Name shortlist from our research: Libre, Wanda, Libreo, Muevo, Rumbo — run USPTO search on your top choice at tmsearch.uspto.gov today.
- Logo: do not spend months on this. Get a simple wordmark designed on Fiverr or 99designs ($50-200). You can refine it later. You cannot launch without it.

**TIP: the logo does not need to be perfect. It needs to exist. Launch with a clean wordmark and refine over the first year.**

**6.2 Analytics — You Cannot Improve What You Cannot See**

Before launch, install:

- Google Analytics 4 or Plausible Analytics (privacy-friendly, GDPR compliant — better for a European-facing product) — tracks page views, quiz completions, upgrade clicks
- Hotjar or Microsoft Clarity (free) — session recordings. Watch real users navigate. You will immediately see where they get confused.
- Stripe Dashboard — already built in. Monitor: trial starts, conversions, churn date, plan distribution
- A simple weekly metrics habit: every Monday, check 5 numbers — new signups, quiz completions, upgrade rate, AI Advisor usage, coaching bookings. That's it.

**6.3 Email — Your Most Valuable Retention Tool**

You have no email sequences yet. Email is how you convert free users, prevent churn, and re-engage dropped users. Build these before launch:

- Welcome email (Day 0): sent immediately after quiz. 'Your Spain plan is ready. Here's what to do first.' In EN or ES based on user language.
- Day 3 nudge: 'You have [X] tasks waiting. The most urgent one is [task name].' Personalized.
- Day 7 (trial ending): 'Your free trial ends in 2 days. Here's what you'll lose access to.' List specifically what locks — not generic.
- Day 10 (if not upgraded): 'Still planning your move? Here's what 3 other people in your situation used Nomadly for.' Social proof.
- Day 30: annual plan offer. 'Save 35% — lock in your full year at $229.'
- Use Resend, Postmark, or SendGrid for transactional email. Use ConvertKit or Loops for marketing sequences.

**DO NOT: do not skip email. Social media reach is declining. Email open rates are 40%+. Your most engaged users will give you their inbox.**

**6.4 Privacy & GDPR**

You are building a product for people moving to Spain — an EU country. GDPR applies to any user in the EU, and your Spain-based users will be EU residents. Required before launch:

- Privacy Policy — covers what data you collect, how you use it, how to delete it. Use Termly.io or Iubenda to generate one ($10-30/month).
- Cookie consent banner — required for EU users. Same tools handle this.
- Data deletion request mechanism — users must be able to request account and data deletion. Add a 'Delete my account' option in settings.
- Do not store any data you do not need. User's move date, visa type, origin, documents — yes. Payment details — never (Stripe handles this).

**6.5 Customer Support**

Before launch, decide how users reach you when something breaks or they have a question:

- Email: hello@[yourdomain].com (already referenced in the product). Forward to your personal email to start.
- A simple FAQ page — 10-15 questions covering: how to change visa type, how to reset quiz, what the AI Advisor can and cannot do, refund policy, how to cancel
- Do not add a live chat widget at launch — you cannot staff it and a slow response is worse than no chat.
- Response time commitment: 48 hours for email. Set this expectation in the footer.

**6.6 Pricing Psychology — One More Thought**

At $29/$59, you are in a zone that requires almost no justification from the buyer. The mental math is: 'This costs less than one Uber ride per week and it's going to help me not get denied a visa.' That is a very easy yes.

One thing to add to the checkout page that will increase conversion: a single testimonial or stat. Even before you have real testimonials, you can use: 'Built by a Puerto Rican who navigated this process alone — so you don't have to.' That is social proof of a different kind, and it is already true.

**6.7 What Success Looks Like at 90 Days**

-----

**Metric**                   **Minimum**            **Strong**

Total signups                100                    300+

Quiz completions             60% of signups         75%+

Free → Wanderer conversion   5%                     10%+

Wanderer → Pro conversion    15%                    25%+

Monthly Recurring Revenue    $500                  $2,000+

Partner pilot accounts       2                      5+

Coaching sessions booked     5                      15+

Churn rate (monthly)         Under 15%              Under 8%

-----

*NOTE: these are realistic targets, not optimistic projections. If you hit the 'Strong' column in 90 days, you have a business. If you hit 'Minimum', you have strong validation and clear data to iterate on.*

**6.8 The One Thing That Determines Everything**

All the strategy in the world does not matter if the product does not retain users past day 7. The dynamic task engine (Section 2 of the Delta Spec) is the single feature that determines whether people come back. A user whose dashboard shows '3 urgent tasks this week, 9 days until your consulate appointment window opens' has a reason to open the app tomorrow. A user who downloaded the visa guide and learned what they needed has no reason to stay.

Ship the task engine before you do any marketing. In that order — not simultaneously.

**The product is real. The market is real. The timing is right. Now execute in order: legal disclaimers → pricing → task engine → document tracker → PR landing page → launch.**
