# NOMADLY — V2 Product Review Spec

**For Claude Code:** Sessions 1–3 complete. Session 4 (task engine) started but NOT committed — STOP and use this updated spec instead. Work through sessions 4–20 in order. Read each session fully before writing any code. Use `PRODUCT_NAME` placeholder for brand name, `placeholder@email.com` for admin email, `TODO: Stripe Price ID` for Stripe. Never rebuild what already exists.

-----

**NOMADLY**

V2 Product Review — Full Update Spec

*Based on live product audit + screenshots · March 2026 · Sessions 4–20*

**STOP: Claude Code completed Sessions 1–3. Session 4 (task engine) was started but NOT committed. Resume from Session 4 using this updated spec.**

**1. Current Status — Read Before Doing Anything**

Sessions 1–3 of the previous delta spec are complete. Session 4 (Dynamic Task Engine) was started but not committed or pushed. This document supersedes the previous spec for all remaining work.

**1.1 What Was Completed (Do Not Redo)**

- Session 1 — Legal disclaimer system: onboarding acknowledgment, AI Advisor disclaimer, visa page banner, ToS clauses
- Session 2 — Pricing update: strings updated in codebase
- Session 3 — Coaching update: pricing and disclaimer copy updated

**1.2 Immediate Stop Order**

**STOP Session 4. Do not commit or push the task engine work started in Session 4. This spec replaces and expands that session with new requirements discovered during the live product review. Wait for the new Session 4 instructions below.**

**1.3 Issues Found in Live Product Review**

The following issues were identified by reviewing nomadly-kohl.vercel.app and screenshots. Each is assigned to a session below.

-----

**#**   **Issue**                                                                        **Session**

1        Pricing shows $19/$37 — not updated to $29/$59                             Session 4 — Quick Fixes

2        Sidebar coaching CTA still shows 15 min · $15                                   Session 4 — Quick Fixes

3        'Browse Visas' button on homepage — remove                                   Session 4 — Quick Fixes

4        'Madrid' hardcoded under Good Morning — remove                               Session 4 — Quick Fixes

5        'Most Popular' badge appears twice on pricing page                             Session 4 — Quick Fixes

6        Pricing header 'Your Move to Spain, Simplified' + Spain flag hardcoded         Session 4 — Quick Fixes

7        Portugal completely — remove from all sections                                 Session 4 — Quick Fixes

8        Housing page not translated to Spanish (rental law grid, market trends)          Session 5 — i18n Fixes

9        Visa checklists/roadmaps not translated to Spanish                               Session 5 — i18n Fixes

10       'Mejorar' wrong word for upgrade in Spanish                                    Session 5 — i18n Fixes

11       Visas y Consulados phrase not translated on page                                 Session 5 — i18n Fixes

12       Consulate cards cluttered with PR flags on every card                            Session 6 — Consulate + PR Cleanup

13       All PR-specific content hardcoded in main product regardless of quiz answer      Session 6 — Consulate + PR Cleanup

14       Roadmap/checklist: consulate info at bottom hardcoded as PR                      Session 6 — Consulate + PR Cleanup

15       Task detail modals contain PR-specific tips regardless of origin                 Session 6 — Consulate + PR Cleanup

16       'My Journey to Spain' hardcoded — must use destination_country variable      Session 7 — Country Variable Sweep

17       AI tips reference specific cities (Málaga) — must be dynamic                   Session 7 — Country Variable Sweep

18       Spain Foreign Buyer Rules section references PR/US specifically                  Session 7 — Country Variable Sweep

19       Notifications open on homepage correctly but content is city-specific            Session 8 — Notifications

20       Checklist checkboxes don't appear in This Week's Tasks widget                  Session 9 — Task Engine (revised)

21       Journey dates are static months — not calculated from quiz date                Session 9 — Task Engine (revised)

22       Free plan only pushes to Wanderer — should show all tiers                      Session 10 — Upgrade Flow

23       Resources: free users see nothing — correct. Need moderation for submissions   Session 11 — Resources

24       Resources tied to phases/checklist items — not yet built                       Session 11 — Resources

25       Pro Hub shows PR consulate + overlaps with journey/docs                          Session 12 — Pro Hub Rebuild

26       Family 3+ only option leads to Pro Hub — family doc tracking needed            Session 12 — Pro Hub Rebuild

27       Housing limited to 6 cities — needs expandable architecture                    Session 13 — Housing Expansion

28       Booking — intro call keep, deep dive remove, rebrand copy                      Session 14 — Booking Cleanup

29       Roadmap and Checklist separate — keep but link them                            Session 15 — Roadmap+Checklist Link

30       AI cost protection — rate limits + API key security                            Session 16 — AI Protection

31       Student verification discount + family 4+ free tools                             Session 17 — Special Access

32       Local business integration / partner pitch package                               Session 18 — Business Partnerships

33       Admin data panel — feed accurate data without code deploys                     Session 19 — Admin Panel

34       Profile lock after payment — prevent data loss                                 Session 20 — Profile Lock

-----

**Session 4 — Quick Fixes (Do These First)**

These are all small targeted fixes. Do them all in one session before moving to larger work. Most are find-and-replace or single-component updates.

**FIX 1 — PRICING**

**4.1 Pricing Still Shows Old Values**

The live site shows Wanderer $19/mo and Pro $37/mo (annual rates). The correct prices are Wanderer $29/mo ($229/yr = $19.08/mo) and Pro $59/mo ($449/yr = $37.42/mo). The annual monthly-equivalent display is correct — but the base monthly price must show $29 and $59.

- Search codebase for all instances of '$9', '$19', '9/mo', '19/mo' — replace with new values
- Monthly prices: Wanderer $29/mo, Pro $59/mo
- Annual prices: Wanderer $229/yr (shown as '$19/mo billed annually'), Pro $449/yr (shown as '$37/mo billed annually')
- Update Stripe product display names and any hardcoded price strings in checkout flow

**DO NOT: do not change the annual monthly-equivalent math — $229/12 = $19.08 shown as $19/mo is correct and intentional**

**FIX 2 — SIDEBAR COACHING CTA**

**4.2 Sidebar Still Shows 15 min · $15**

The sidebar coaching card shows the old pricing and copy. Update to:

- Title: 'Got questions? Let's talk'
- Subtitle: '20 min · $45 · General questions about the process or the product'
- Disclaimer line: 'General guidance only — not legal advice'
- Button: 'Book a Call →'
- Remove the 'About your coach' bio section entirely from the sidebar card

**DO NOT: do not show the booking CTA to partner-invited clients — only to self-signup users. Add a check: if user.invitedByPartner === true, hide the booking card entirely**

**FIX 3 — REMOVE BROWSE VISAS**

**4.3 Remove 'Browse Visas' from Homepage**

- Remove the 'Browse Visas' button from the homepage hero section entirely
- Keep 'Take the Free Quiz →' as the only CTA in the hero
- The quiz stat bar (2 min, 5 visas, 2 years) stays as-is

**FIX 4 — REMOVE MADRID**

**4.4 Remove City from Dashboard Header**

- Remove 'Madrid' (or any hardcoded city name) from the 'Good morning' dashboard header
- The header should read: 'Good morning ✦' followed by '[destination_country] · [X] days to go'
- If user has not selected a destination city, do not show a city at all
- If user selects a city later (in settings or profile), it can appear — but never default to Madrid

**FIX 5 — MOST POPULAR BADGE**

**4.5 'Most Popular' Appears Twice on Pricing Page**

Currently 'Most Popular' appears on both the annual toggle bar AND on the Pro card. Pick one location only.

- Remove 'Most Popular' from the toggle bar
- Keep 'Most Popular' badge only on the Pro card itself
- The toggle bar should only show: 'Monthly | Annual · Save 35%'

**FIX 6 — PRICING HEADER**

**4.6 Pricing Page Header is Country-Specific**

Header currently reads 'Your Move to Spain, Simplified' with a Spain flag emoji. This must be dynamic.

- Replace hardcoded 'Spain' with destination_country variable: 'Your Move to [destination_country], Simplified'
- Replace hardcoded flag emoji with destination_country flag variable
- If no country is set yet (pre-quiz), show: 'Your Relocation, Simplified' with no flag

**FIX 7 — REMOVE PORTUGAL**

**4.7 Remove Portugal from All Sections**

Portugal is 'Coming Soon' but is actively showing in multiple places. Remove it completely until ready to launch.

- Remove Portugal tab from property price section in Budget
- Remove Portugal land prices section from Budget
- Remove Portugal from savings runway city dropdown
- Remove Portugal D7 visa card from Visa Guides
- Remove Portugal from Consulate Directory filter
- Remove 'Portugal Soon' from left sidebar My Relocations
- Remove Portugal tab from any other section where it appears

*NOTE: Keep the architecture in place — destination_country variable, country config files, i18n structure. Only remove Portugal-specific content and UI references. Re-adding Portugal later should only require populating a pt.json config file.*

**Session 5 — Spanish Translation Fixes**

Based on live screenshots, the following sections are not translating when the ES toggle is active. Fix all of them. Every user-facing string must route through the i18n translation system.

**5.1 Upgrade Button — Wrong Spanish Word**

- Current: 'Mejorar' — this means 'to improve/get better' — wrong context
- Replace with: 'Actualizar' — means to upgrade/update a plan — correct context
- Search all instances of 'Mejorar' used as an upgrade CTA and replace with 'Actualizar'
- Also check: 'Mejorar →' button in header — update to 'Actualizar →'

**5.2 Sections Not Translating to Spanish**

When ES toggle is active, these sections remain in English. Each needs i18n keys added:

-----

**Section**                              **What needs translation**

Visa checklists                          All phase titles (Phase 1 — Prepare, Phase 2 — Documents etc.), all checklist item labels, task detail modals

Roadmap                                  All phase names, task titles, info modals, cost/timeline labels

Housing — Rental Law grid              'Lease Length', 'Deposit', 'Agency Fees', 'Empadronamiento', 'Utilities', 'PR to Spain Tips' — all content inside these tiles

Housing — Rental Market Trends         'Málaga rent increase YoY', 'Madrid rent increase YoY' etc. labels and the PR Expat Strategy tip at bottom

Housing — Platforms section            Platform descriptions (Spotahome, Idealista, Fotocasa, HousingAnywhere)

Visas y Consulados page                  Tab labels, filter labels, consulate card content, the PR banner at top

Notifications panel                      All notification message strings

Budget — Best Areas for Appreciation   All neighborhood names and descriptions

Budget — Non-Resident Mortgage         All mortgage detail labels and values

Booking sidebar card                     New copy from Fix 2 above must also have Spanish translation

-----

**5.3 Translation Keys for New Spanish Strings**

Add these to /locales/es/common.json:

> "upgrade_button": "Actualizar"
> 
> "upgrade_button_arrow": "Actualizar →"
> 
> "booking_title": "¿Tienes preguntas? Hablemos"
> 
> "booking_subtitle": "20 min · $45 · Preguntas generales sobre el proceso o el producto"
> 
> "booking_disclaimer": "Orientación general únicamente — no es asesoría legal"
> 
> "booking_cta": "Reservar una llamada →"
> 
> "phase_prepare": "Fase 1 — Preparar"
> 
> "phase_documents": "Fase 2 — Documentos"
> 
> "phase_apply": "Fase 3 — Solicitud"
> 
> "phase_predeparture": "Fase 4 — Pre-Partida"
> 
> "phase_arrival": "Fase 5 — Llegada"

**5.4 'PR to Spain Tips' — Make Country-Variable**

The housing rental law grid has a hardcoded 'PR to Spain Tips' tile. This must be dynamic:

- Rename to: '[origin] to [destination_country] Tips'
- Content inside should load from a country-pair config: origin_country → destination_country tips
- For PR → Spain: keep current content
- For US mainland → Spain: show different tips (no PR consulate reference, different apostille note)
- For future country pairs: content pulls from config file

**Session 6 — Consulate Cards + PR Content Cleanup**

Two problems: (1) Consulate cards are cluttered with PR flags on every card. (2) PR-specific content is hardcoded throughout the product regardless of what the user selected in the quiz. Fix both.

**6.1 Consulate Directory — Clean Up Cards**

Currently every consulate card shows a PR Jurisdiction badge with a PR flag. This is visually cluttered and only relevant to PR users. Fix:

- Remove the PR flag emoji and 'PR Jurisdiction' badge from every consulate card
- Replace with a clean, dynamic jurisdiction note that reads based on user.origin:
- If user.origin === 'PR': show a small tag 'Your jurisdiction' on the relevant consulate card only
- If user.origin === 'mainland': show jurisdiction based on their US state (if collected) or show nothing
- The PR banner at the top of the consulate page (the full-width info bar about San Juan consulate) — move this to the /puerto-rico page only. Do not show it in the main consulate directory unless user.origin === 'PR'
- Each consulate card should show: country flag, country name, city, email, website. Clean and minimal.
- Full address detail (like Spain card currently has) should be in an expanded view when user taps the card — not shown by default

**6.2 Consulate Selection — User Chooses Their Consulate**

You asked whether users can select which consulate they'll apply to so it displays throughout. Yes — add this.

- After quiz completion, show a one-time prompt: 'Which consulate will you apply through?' with options filtered by user.origin
- If user.origin === 'PR': default to San Juan, option to choose Miami
- If user.origin === 'mainland': show relevant US consulates for Spain (Miami, Houston, LA, NYC, Chicago, Boston)
- Store as user.selected_consulate
- The selected consulate then appears in: roadmap tasks ('Book appointment at [consulate name]'), document tracker notes, journey phase info
- User can change their selected consulate in profile settings

**6.3 PR-Specific Content — Conditional Rendering Audit**

Claude Code must audit every file in the codebase for hardcoded PR-specific content and wrap it in conditional logic. This is a full code review task.

- Search for: 'Puerto Rico', 'PR', 'Boricua', 'San Juan', '787-', 'PR expat', 'PR →', 'Leave PR', 'From PR'
- For each instance found: determine if it should be (a) shown only when user.origin === 'PR', (b) moved to the /puerto-rico page, or (c) replaced with a dynamic variable

-----

**Content**                                            **Rule**

San Juan consulate details                             Show only if user.origin === 'PR' OR user.selected_consulate === 'San Juan'

'Leave PR' label on budget timeline                  Replace with 'Leave [origin_country]' — dynamic

'PR → Citizenship (24 mo)' timeline label            Show only if user.origin === 'PR'. Otherwise show standard citizenship timeline

PR apostille instructions in task modals               Show only if user.origin === 'PR' (via pr_override in task schema)

'Most PR expats ship...' tips                       Show only if user.origin === 'PR'

'PR Expat Strategy' tip in housing                   Replace with '[origin] Expat Strategy' — load from origin_country config

PR flags in consulate cards                            Remove entirely — replace with dynamic jurisdiction logic (Fix 6.1)

Marriage Certificate Guide — PR Consulate resource   Tag with origin_country: 'PR'. Only show to PR users

-----

**6.4 'Book a Call' at Bottom of Roadmap/Checklist**

This appears for all users. Your decision: keep for partner-invited clients only, remove for self-signup users.

- Add conditional: if user.invitedByPartner === true → show 'Book a call with your advisor' (using partner's contact, not your Calendly)
- If user.invitedByPartner === false (self-signup) → hide the booking prompt from roadmap/checklist entirely
- The sidebar booking card (Got questions? Let's talk) remains for all self-signup users — this is the only booking touchpoint for independent users

*NOTE: This cleanly separates the product experience (self-signup) from the service experience (partner-invited). Self-signup users get the AI Advisor and the sidebar call option. Partner clients get their advisor's contact.*

**Session 7 — Country Variable Sweep**

Every hardcoded reference to 'Spain' in user-facing content must become a variable. This is the most important architectural task for future country expansion. It is a full codebase sweep.

**7.1 The Rule**

destination_country is set from the quiz (currently always 'Spain'). Every piece of user-facing content that references the destination must use this variable. Content that is country-specific (visa rules, costs, laws) must live in a country config file.

**DO NOT: do not change backend logic or database field names — only user-facing display strings and content loading**

**7.2 Strings to Make Dynamic**

-----

**Hardcoded String**                                   **Replace With**

'My Journey to Spain'                                'My Journey to [destination_country]'

'Your Move to Spain, Simplified'                     'Your Move to [destination_country], Simplified'

Spain flag emoji in pricing header                     destination_country flag — loaded from country config

'City data (Spain)' in Wanderer features             'City data ([destination_country])'

'Rental Market Trends — Spain 2025–2026'          'Rental Market Trends — [destination_country] [year]'

'Average Price per m² — Spain'                     'Average Price per m² — [destination_country]'

'Spain Foreign Buyer Rules'                          'Foreign Buyer Rules — [destination_country]' loaded from country config

'Ley de Alquiler en España'                          Load rental law title from country config

AI Advisor intro summary                               Generic: 'Your relocation advisor. Ask me anything about your move.' No country in intro.

Educational disclaimer 'Spanish consulate website'   'Official [destination_country] consulate website' + dynamic link from country config

'exteriores.gob.es' in disclaimer                    official_source_url from country config

AI tips referencing specific cities                    Load from country_tips[] array in country config. No hardcoded city names in tip strings.

-----

**7.3 Country Config File Structure**

Create /data/countries/es.json with this structure (and empty /data/countries/pt.json stub for future):

> {
> 
> "code": "es",
> 
> "name": "Spain",
> 
> "flag": "🇪🇸",
> 
> "official_source_url": "https://exteriores.gob.es",
> 
> "currency": "EUR",
> 
> "currency_symbol": "€",
> 
> "citizenship_years_standard": 10,
> 
> "citizenship_years_iberoamerican": 2,
> 
> "rental_law_title": "Spanish Rental Law (LAU 2019)",
> 
> "rental_law_title_es": "Ley de Arrendamientos Urbanos (LAU 2019)",
> 
> "cities": ["Madrid","Málaga","Sevilla","Valencia","Barcelona","Granada","Alicante","Bilbao","Zaragoza","Murcia"],
> 
> "city_costs": { "Madrid": 2100, "Málaga": 1700, ... },
> 
> "ai_tips": ["tip1","tip2","tip3"],
> 
> "origin_tips": {
> 
> "PR": "PR-specific tips for Spain",
> 
> "mainland": "Mainland US tips for Spain"
> 
> }
> 
> }

**Session 8 — Notifications System**

The notification panel works and is well-positioned. Two issues: (1) notification content references specific cities (Málaga) rather than the user's context, (2) notifications are not real-time — they appear to be static examples.

**8.1 Make Notification Content Dynamic**

Current notification: 'AI tip: Málaga rent is 24% cheaper than Madrid' — hardcoded city.

- AI tips in notifications must come from the country_tips[] array in the country config — never hardcoded
- Task-based notifications must reference the user's actual tasks: 'Your [task_name] is due in [X] days'
- Document notifications must reference the user's actual documents: 'Your [document_name] expires in [X] days'

**8.2 Notification Types to Build**

-----

**Type**             **Trigger + Content**

Task urgent          Triggered when a task's due_date is within 7 days. '[Task name] is due in [X] days. Tap to view.'

Document expiry      Triggered when document expiry_date is within 30 days. 'Your [document] expires in [X] days — time to renew.'

Progress milestone   Triggered when user completes a phase. 'Phase [X] complete! You're [X]% of the way there.'

AI tip               One tip per day max. Loaded from country config ai_tips[]. Rotated, not repeated.

Upgrade nudge        Triggered by conditions in upgrade trigger spec (Session 11). Max 1 per week.

-----

**8.3 Notification Delivery**

- In-app bell: already works — keep as-is, fix content
- Email notifications: send for task urgent and document expiry only. Use user's language preference for email language.
- Browser push (PWA): optional future feature — add a 'Enable push notifications' prompt after user completes quiz. Do not build the push infrastructure now — just add the prompt and store user.push_enabled preference

**TIP: do not send more than 1 notification per day total to any user. Stack notifications if multiple triggers fire on the same day.**

**Session 9 — Task Engine (Revised from Session 4 Delta Spec)**

This replaces the Session 4 task engine spec from the previous document. Key additions: checklist checkboxes must appear in This Week's Tasks widget, journey dates must be calculated from quiz completion date (not static months), and dates must be user-editable.

**9.1 This Week's Tasks — Add Checkboxes**

Currently the This Week's Tasks widget on the dashboard shows tasks but no checkboxes. Users cannot check off tasks from the widget.

- Add a checkbox to each task row in the This Week's Tasks widget
- Checking a task in the widget marks it complete in the full task list — same state, synced
- Completed tasks in the widget show with strikethrough and move to a 'Done this week' collapsed section
- The widget count ('X tasks remaining') updates immediately when a task is checked

**9.2 Dynamic Date Calculation**

Journey phases and task due dates must be calculated from the user's quiz_date (when they completed the quiz) and move_date (their target move date). Not static month names.

- Store quiz_date = date when user completes quiz (auto-set)
- Store move_date = derived from quiz question 'When are you planning to move?' — convert answer to an actual date:

> "In the next 3 months" → quiz_date + 90 days
> 
> "3–6 months" → quiz_date + 135 days (midpoint)
> 
> "6–12 months" → quiz_date + 270 days (midpoint)
> 
> "1–2 years" → quiz_date + 548 days (midpoint)
> 
> "Just exploring" → no move_date set, show tasks without dates

- Each task's due_date = move_date + due_offset_days (negative = before move)
- Display dates as: 'Due [Month Day]' — e.g. 'Due Jun 15' — never as 'Month 3 of your journey'
- Phase labels show date ranges: 'Phase 1 — Prepare (Now → [date])' based on the tasks in that phase

**9.3 User-Editable Dates**

Users must be able to adjust their move_date and individual task due dates without retaking the quiz.

- Add an 'Edit timeline' button at the top of the Journey page
- Clicking opens a simple date editor: 'Your target move date: [date picker]'
- Changing move_date recalculates ALL task due_dates automatically
- Individual tasks also have an edit icon — tapping lets user override the auto-calculated due_date for that task only
- User-overridden dates show a small 'edited' indicator
- 'Reset to auto' option restores the calculated date

*NOTE: Data persistence: all dates must be saved to the user's profile immediately on change. No data should ever be lost when a user changes their timeline.*

**9.4 Task Schema — Updated**

Use this schema (same as previous spec but with date fields added):

> { id, title, description, category, visa_types[], family_types[],
> 
> origin_types[], due_offset_days, depends_on[], estimated_days,
> 
> estimated_cost_usd, how_to_steps[], official_link,
> 
> pr_override?, // PR-specific step overrides
> 
> user_overridden_date?, // null unless user edited
> 
> country_code: "es" // which country this task belongs to
> 
> }

**Session 10 — Upgrade Flow Fix**

Free plan currently only shows a push to Wanderer. Users should see all available tiers so they can make an informed decision. Fix all upgrade prompts.

**10.1 Free Plan Default Track Message**

Current: '📋 DEFAULT TRACK — Non-Lucrative Visa (NLV) · 1/3 tasks complete — Free plan: Phase 1 only. Unlock Wanderer for all phases →'

Fix: Show both Wanderer and Pro as options:

- Change to: 'Free plan: Phase 1 only. Unlock your full plan:'
- Show two buttons side by side: [Wanderer — $29/mo] and [Pro — $59/mo]
- Under each button: 2-3 key features in small text so user can compare without going to pricing page

**10.2 All Upgrade Prompts — Show Both Tiers**

- Every 'Unlock Wanderer →' button in the app should also offer Pro as an alternative
- Suggested pattern: primary button 'Unlock Wanderer ($29/mo)' with secondary link 'Or go Pro ($59/mo) — includes AI Advisor'
- Exception: if the locked feature is Pro-only (AI Advisor, roadmap PDF), show only Pro option

**Session 11 — Resources Page**

Free users see nothing (correct). Paid users can add and rate resources. Community submissions require moderation. Resources should be tied to journey phases and filterable by country.

**11.1 Access Rules**

-----

**Tier**        **Access**

Free            See locked resource cards with category and title visible, content blurred. No add or rate access.

Wanderer        Full read access to all resources. Can rate resources. Cannot submit new resources.

Pro             Full read access. Can rate AND submit new resources. Submissions go to admin approval queue.

-----

**11.2 User-Submitted Resources — Moderation Flow**

- Pro users tap '+ Add Resource' → fill in: name, category, country, cost, description, website, pro tip
- Submission goes to status: 'pending_review' — not visible to other users yet
- Admin receives notification in admin panel (Session 19)
- Admin approves → resource becomes visible to all paid users
- Admin rejects → submitter receives notification with reason
- Approved resources show 'Community submitted' badge and star rating
- Resources submitted by PR users for PR-specific content get tagged with origin_country: 'PR'

**11.3 Resources Tied to Journey Phases**

- Each resource can be tagged with phase[] and visa_types[] in the resource schema
- When a user is viewing a task in the journey that has related resources, show a small 'Related resources' link
- Example: task 'Get health insurance quote' → links to Health resources tagged phase: 'pre-departure'
- This replaces the generic info section on task modals — instead of static text, link to curated resources

**11.4 Country Filter**

- Add a country filter to the resources page: 'All Countries | Spain | [future countries]'
- Resources are tagged with country_code in their schema: 'es', 'pt', 'all'
- Default filter: show resources tagged with user's destination_country + 'all'
- Resources tagged 'all' are universal (Wise, N26, international movers) and always shown

**11.5 Formatting Fix**

- Resource cards currently show inconsistently — standardize card height and layout
- Each card: category badge (top left), title, description (2 lines max, truncate), cost badge, star rating, 'Verified [date]' or 'Community submitted', Visit → button
- Phase/visa tag shown as small chips below the description

**Session 12 — Pro Hub Rebuild**

The Pro Hub currently shows PR as the default consulate, overlaps with the main Journey and Documents sections, and lacks the premium tools that justify the Pro price. This session rebuilds it as a genuinely valuable Pro-only space.

**12.1 What the Pro Hub Should Be**

The Pro Hub is for Pro subscribers only. It is NOT a duplicate of the Journey or Documents tabs. It contains three things the main product does not: premium calculators (already partially built), document templates and examples, and family member tracking.

**12.2 Remove from Pro Hub**

- Remove any consulate reference that defaults to PR — apply Session 6 conditional logic
- Remove any duplicate journey phase view — the Pro Hub is not a second journey tab
- Remove any duplicate document checklist — the main Documents tab handles this

**12.3 What Stays in Pro Hub**

- All Pro-tier budget calculators: 10-year buy vs rent projection, mortgage simulator, rental yield calculator, investment analysis
- These should be MOVED from the Budget tab into the Pro Hub — the Budget tab shows Wanderer-accessible tools, Pro Hub shows the advanced calculators
- In the Budget tab: show the Pro calculator cards as locked previews with 'Available in Pro Hub →' link

**12.4 Add to Pro Hub — Document Templates**

Pro users get access to example documents — not filled-in real documents, but templates and examples they can use as reference:

- Letter of Intent (for NLV/DNV application cover letter)
- Affidavit of Proof of Residency (example format)
- Medical Clearance Letter (example format accepted by Spanish consulates)
- Income Declaration Letter (for freelancers/self-employed)
- Each template: downloadable PDF or Google Doc link, with a note 'This is an example only — not a legal document'
- Templates tagged with visa_type[] so only relevant templates show per user

**12.5 Family Member Document Tracking**

When user.family_type === 'couple' or 'family', Pro Hub adds a family document tracker:

- Main applicant documents tracked in main Documents tab (unchanged)
- Pro Hub adds: 'Family Member Documents' section
- For couple: one additional set — labeled 'Spouse/Partner'
- For family: one set per dependent — labeled 'Child 1', 'Child 2' (user can rename)
- Each family member has their own document list filtered by their relationship type: spouse needs different docs than a child
- Family member document schema: same as main document schema but with family_member_id field

**12.6 Income Requirements by Family Type**

Income requirements are different for solo, couple, and family. This must be reflected everywhere:

- Solo NLV: €2,259/mo
- Couple NLV: €2,259 + 25% = ~€2,824/mo
- Family (2 kids): €2,259 + 25% + 25% = ~€3,384/mo
- These values must load from the country config (es.json) — not hardcoded
- The profile header income requirement badge (shown on dashboard) must reflect user's family_type
- Visa requirement cards must show the income requirement for the user's family_type, not a generic number

**12.7 Pro Hub Add-Ons Brainstorm**

Ideas for Pro Hub add-ons that enhance value without requiring you to provide service:

- Curated vetted attorney directory with 'Request intro' form (attorney pays to be listed, user contacts them directly)
- Country-specific tax calculator (Beckham Law estimator for DNV users)
- NIE appointment tracker — user enters appointment date, countdown shows
- Sworn translator directory — translators in PR and Spain who are accredited for consulate submissions
- 'Ask the community' — Pro users can post questions, other Pro users answer (moderated, async)

*NOTE: The 'Ask the community' feature is the lightest version of community. No real-time chat. Just a Q&A board. Easier to moderate, less infrastructure, still creates network effects.*

**Session 13 — Housing Section Expansion**

Currently limited to 6 cities. You want it to cover all of Spain (and future countries) without being overwhelming. Here are three options — pick one.

**13.1 Options**

-----

**Option**   **Approach**                **Pros / Cons**

A            Region-based browsing       Spain divided into regions (Andalucía, Cataluña, Madrid, Valencia, etc.). User picks region, then sees cities within it. Scalable, not overwhelming. Recommended.

B            Search + filter             Free-text search with filters (coast/inland, budget range, climate). More flexible but more complex to build. Better for later.

C            Quiz-based recommendation   Based on visa type, budget, and family size from quiz, show top 3 recommended cities with comparison. Simplest but least exploratory.

-----

**13.2 Recommended Implementation — Option A (Region-Based)**

- Add a region selector above the city cards: 'All | Andalucía | Madrid | Valencia | Cataluña | Basque Country | Canary Islands | Other'
- Selecting a region filters the city cards to show only cities in that region
- City data lives in the country config (es.json) under 'cities' — each city has: name, region, avg_rent_1bed, avg_rent_2bed, avg_property_price_m2, yoy_increase, cost_of_living_index, climate_tag, expat_community_size, visa_friendly_tag
- Free users see 3 cities max — others blurred with 'Unlock Wanderer for all cities'
- Wanderer users see all cities for their destination country
- Adding a new country: add cities to that country's config file. No code changes needed.

**Session 14 — Booking Cleanup**

Keep the intro call. Remove the deep dive. Rebrand everything away from 'coaching'.

**14.1 What to Keep**

- Intro call: 20 min · $45
- Rename to: 'Got questions? Let's talk'
- Description: 'General questions about the relocation process or the product — not legal advice'
- Remove all mentions of 'coach', 'coaching', 'your coach'

**14.2 What to Remove**

- Remove deep dive ($149 / 60 min) entirely
- Remove 'Revisión Prioritaria de Documentos $149' add-on from journey page (Image 1)
- Remove 'Consulta de Ciudad y Barrio $79' add-on
- Remove 'Sesión de Estrategia de Visa $99' add-on
- These add-ons can come back later as partner-delivered services — for now remove all of them

**14.3 About Section — Remove Coach Bio**

- Remove: 'Puerto Rican currently navigating the Spain NLV process firsthand. Consulate appointment completed, documents in progress, flight booked for July. Real experience, real answers.'
- Replace with nothing — the call description is sufficient
- Search entire codebase for this bio copy and remove all instances

**14.4 Where Booking Appears — Full Audit**

Search and update ALL locations where booking is mentioned:

- Sidebar card — updated in Session 4
- Bottom of roadmap/checklist — conditional per Session 6
- Journey page add-ons section — remove all (Session 14.2 above)
- Pro Hub — if present, remove
- Any modal or tooltip that mentions booking or coaching

**Session 15 — Roadmap + Checklist — Keep Separate, Link Together**

Decision: keep roadmap and checklist as separate views but link them so they complement each other without duplicating.

**15.1 The Difference**

- Roadmap: visual, phase-based overview. Shows the big picture — what phase you're in, what's coming, approximate timeline. Good for orientation.
- Checklist: task-level detail. Shows individual items to complete within each phase, with checkboxes, due dates, and cost/time info. Good for day-to-day.

**15.2 How to Link Them**

- On the Roadmap, each phase block has a button: 'View [X] tasks in this phase →' that opens the Checklist filtered to that phase
- On the Checklist, a breadcrumb at top shows: 'Phase 2 — Documents' with a link back to the Roadmap
- Completing all tasks in a phase on the Checklist automatically marks that phase complete on the Roadmap
- The Roadmap progress bar reflects Checklist completion — same data, different views

**15.3 Fix Phase Date Display**

- Roadmap phases show date ranges calculated from move_date (Session 9)
- Replace any static month labels with calculated date ranges: 'Phase 1 — Prepare (Now — [date])'
- Checklist task rows show: task name, due date (calculated), category icon, checkbox

**Session 16 — AI Cost Protection + API Security**

**16.1 API Key Security — Critical**

The Anthropic API key must NEVER be in frontend code. Verify this immediately.

- Check: is ANTHROPIC_API_KEY in any .js, .tsx, or .jsx file that runs in the browser? If yes — move it immediately to a server-side API route
- All AI Advisor requests must go through a backend API route (e.g. /api/ai-advisor) that calls Anthropic server-side
- The frontend sends the user's message to /api/ai-advisor — the backend adds the API key and forwards to Anthropic
- Add the API key to Vercel environment variables (not in code)

**DO NOT: if the API key is in frontend code it can be extracted by anyone who views source — this is a security emergency, fix before anything else**

**16.2 Rate Limiting**

-----

**Tier**        **Daily AI messages**       **When limit hit**

Free            0 — AI Advisor locked     Show upgrade prompt

Wanderer        10 messages/day             'You've reached today's AI limit. Resets tomorrow at midnight.'

Pro             30 messages/day             Same message — resets tomorrow

-----

- Store message count in database: user.ai_messages_today and user.ai_messages_reset_date
- Reset count when current date > ai_messages_reset_date
- Show remaining count in AI Advisor: 'X messages remaining today' — small text below input

**16.3 Cost Monitoring**

- Set up a Anthropic Console spending alert at $20/month
- Log each AI request in database: user_id, timestamp, message_length, response_length — this helps identify abuse
- If a single user sends 50+ messages in one day despite the limit, flag for review in admin panel

**Session 17 — Special Access: Students + Large Families**

**17.1 Student Verification + Discount**

Students get a discount in exchange for verification. Options:

-----

**Option**   **Method**                     **Pros / Cons**

A            Email domain verification      Student provides .edu email. Auto-verified. Simple but not all schools use .edu — especially PR/Latin American schools.

B            Upload student ID photo        User uploads ID. You manually approve in admin panel. More accurate but requires your time.

C            SheerID or Student Beans API   Third-party verification service. Automated, accurate, $0.50-1 per verification. Most scalable.

-----

Recommendation: Option A for launch (fast, no cost), with a note that non-.edu students can email for manual verification. Switch to Option C when volume justifies the cost.

- Student discount: Wanderer at $15/mo (instead of $29), Pro at $35/mo (instead of $59)
- Student plan shows a 'Student verified' badge on profile
- Implement: add student_verified: boolean to user schema, add verification flow in settings

**17.2 Large Family Free Tools**

Families of 4+ people get access to some tools for free to acknowledge the complexity of their move.

- If user.family_size >= 4: unlock the family document tracker in Pro Hub for free
- If user.family_size >= 4: unlock the income requirement calculator for free (so they can see exactly what they need)
- These users see a banner: 'Moving with a large family? We've unlocked these tools for you.'
- All other Wanderer/Pro features remain gated — this is a goodwill gesture, not a full plan

**Session 18 — Local Business Integration + Partner Pitch**

You want to integrate local businesses (attorneys, gestorías, financial advisors, relocation services) and create a pitch package. This session builds the infrastructure and the pitch.

**18.1 The Model**

Two tracks: (1) Free directory listing — businesses listed in Resources, users contact them directly. (2) Paid Partner account — businesses get a co-branded dashboard and invite clients (built in Session 12 of previous spec).

**18.2 Partner Pitch Package — What to Include**

Create a one-page pitch PDF (separate from this spec — design separately) that includes:

- What the product is: 'A bilingual relocation platform used by PR/US citizens moving to Spain'
- Your user base: 'People who are actively planning their move — they need your services'
- The offer: 'Free 90-day pilot — invite up to 5 clients, they get Pro access, you get their progress dashboard'
- What they get: co-branded experience, client progress visibility, featured listing in directory
- What you get: partner fee after trial, testimonial, referral relationship
- No contracts required — Partner ToS accepted at signup

**18.3 Discount for Promoting the Product**

Your idea: businesses that promote the product get a discount on their Partner subscription.

- If a business refers a user who converts to paid: they earn a credit toward their partner fee
- Track referrals via UTM parameters or a referral link in their partner dashboard
- Example: refer 3 paying users → get 1 month free on their partner plan
- This creates a mutually beneficial relationship without requiring a formal contract

**18.4 Build — Partner Referral Tracking**

- Each partner account gets a unique referral link: [productdomain]/r/[partner-code]
- Users who sign up via a referral link have partner_referral_code stored on their account
- When a referred user converts to paid: increment partner.referral_count, check threshold for credit

**Session 19 — Admin Panel**

You need to be able to update content (visa info, tips, resources, city data) without code deploys. You need to review and approve user-submitted resources. You need to monitor AI usage and flag abuse. All of this lives in a simple admin panel.

**19.1 Admin Panel Access**

- URL: [productdomain]/admin
- Accessible only to ADMIN_EMAIL (set in environment variable)
- Redirect all non-admin users to homepage if they hit /admin

**19.2 Admin Panel Sections**

-----

**Section**            **What it does**

Resources Queue        Lists pending user-submitted resources. Approve or reject with one click. Rejection sends notification to submitter.

Content Editor         Edit visa guide content, AI tips, city data, country config values — without touching code. Saves to JSON config files or database.

User Overview          Total signups, paid users, tier distribution, daily active users. Simple numbers — no personal data displayed.

AI Usage Monitor       Total AI messages today/this month, estimated cost, top users by message count, any user over 50 messages flagged.

Partner Accounts       List of partner accounts, their tier, client count, referral count, credit balance.

Student Verification   Queue of manual student verification requests (if using Option B from Session 17). Approve or reject.

-----

*NOTE: The admin panel does not need to be beautiful — it just needs to work. Plain functional UI is fine. It is only for you.*

**Session 20 — Profile Lock + Data Safety**

Users should be able to lock their profile after they've set it up correctly, so nothing accidentally changes. All data entered must be preserved — no information should ever be lost.

**20.1 What Gets Locked**

-----

**Field**                   **Lockable?**

Origin (PR / mainland)      Yes — locked after quiz. User can unlock by retaking quiz.

Visa type                   Yes — locked after quiz. Unlock requires manual confirmation.

Family type                 Yes — locked. Unlock via settings with warning.

Move date                   No — always editable. Life changes.

Task completion status      No — always editable.

Document status             No — always editable.

Notes and uploads           No — always editable.

Language preference         No — always editable.

Selected consulate          No — always editable.

-----

**20.2 Lock Mechanism**

- After a user upgrades to a paid plan, show a one-time prompt: 'Lock your profile? This saves your visa type, origin, and family size so nothing changes accidentally. You can always unlock in settings.'
- Buttons: [Lock My Profile] and [Keep Flexible]
- If locked: quiz answers (origin, visa_type, family_type) are read-only throughout the app
- 'Retake quiz' button still appears but shows a warning: 'Retaking the quiz will unlock and update your profile. Your task and document history will be preserved.'
- Retaking quiz never deletes task completion history, document status, notes, or uploads — only updates the profile fields

**20.3 Data Safety Rules for Claude Code**

- NEVER delete user data on quiz retake — only UPDATE profile fields, preserve all other records
- NEVER reset task completion status when quiz is retaken
- NEVER clear document tracker on any user action
- All user data must be saved to database immediately on change — no reliance on local state that could be lost on page refresh
- Before any destructive action (quiz retake, profile unlock), show a confirmation modal explaining what will and will not change

**Business Advisor Notes — Decisions Needed**

These items require your decision before Claude Code can build them. Review and decide, then give Claude Code the specific instruction.

**A. LLC Registration**

Based on your July move to Málaga: Act 60 requires 183 days/year in Puerto Rico — ongoing, every year. If you are relocating to Spain permanently, you will not qualify. Recommendation: register in Delaware (standard for US tech startups, no residency requirement, better for future investors). Get your EIN immediately at irs.gov after LLC registration — required for Stripe.

**B. Student Verification Method**

Choose Option A (email domain, free, fast) or Option C (SheerID, $0.50/verification, automated). Decide before Session 17.

**C. Community Features**

You chose: users can add + rate resources. You also asked about a community chat. Recommendation: start with resources only (Session 11). Add async Q&A board in Pro Hub (Session 12) as the next step. Real-time chat is a moderation burden — do it in Month 4+ when you have enough users to make it self-sustaining.

**D. Name + Logo**

Still unresolved — this blocks PWA, App Store submission, trademark filing, and domain purchase. Set a hard deadline: decide within 7 days of reading this. Top candidates: Libre, Libreo, Wanda, Muevo.

**E. Analytics Stack**

Install before first paying user: Plausible Analytics (privacy-friendly, GDPR compliant, $9/mo) + Hotjar free plan (session recordings). These give you the data to make every future decision based on real user behavior.

**Session order: 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12 → 13 → 14 → 15 → 16 → 17 → 18 → 19 → 20. Do not skip sessions. Each builds on the previous.**
