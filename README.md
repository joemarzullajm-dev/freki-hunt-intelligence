# Freki Hunt Intelligence

Build a premium, responsive web application called Freki.

Freki is an AI-powered hunting and outdoor property intelligence platform. It helps hunters organize property information, understand wildlife movement, evaluate hunting conditions, and make decisions based on evidence instead of vague predictions.

Brand tagline:

“We give you the why.”

This first version should be a polished, stable MVP that demonstrates the complete product vision using realistic sample data. Prioritize reliability, design quality, responsive behavior, and functional workflows over advanced third-party integrations.

Do not build a generic hunting website. Freki should feel like a serious intelligence platform designed for experienced hunters, landowners, habitat managers, and hunting clubs.

==================================================

1. PRODUCT PRINCIPLES

==================================================

Freki should:

- Explain conclusions instead of merely displaying scores.

- Clearly distinguish facts, observations, assumptions, and predictions.

- Show uncertainty honestly.

- Help the user understand why a hunt may or may not be productive.

- Learn from property-specific information.

- Organize fragmented hunting data into one coherent system.

- Feel useful before any real integrations are connected.

- Work well on desktop, tablet, and mobile.

- Avoid exaggerated claims about predicting animal behavior.

Every recommendation should answer:

- What does Freki think?

- Why does it think that?

- What evidence supports the conclusion?

- What evidence conflicts with it?

- How confident is Freki?

- What could change the conclusion?

==================================================

2. TECHNICAL FOUNDATION

==================================================

Create a modern React and TypeScript web application.

Use:

- React

- TypeScript

- Tailwind CSS

- shadcn/ui or an equivalent polished component system

- Lucide icons

- React Router

- Recharts where charts are useful

- Supabase-ready architecture

For this first build:

- Use realistic mock data.

- Do not require API keys.

- Do not require paid services.

- Do not block the demo behind real authentication.

- Include a guest demo entry.

- Make all major navigation, forms, filters, dialogs, tabs, and buttons functional.

- Persist reasonable demo changes locally when possible.

- Keep code organized so the project can later be exported to GitHub and edited in Cursor.

- Avoid unnecessary complexity and fragile dependencies.

- Include clear loading, empty, success, and error states.

Prepare the app architecture for future Supabase support, including:

- authentication

- database

- file storage

- row-level security

- user properties

- observations

- cameras

- camera images

- map markers

- hunt records

- AI conversations

Do not activate integrations that require credentials during the initial build.

==================================================

3. BRAND AND VISUAL DESIGN

==================================================

The visual direction should be premium, restrained, rugged, and intelligent.

Use a visual system based on:

- deep charcoal

- near-black

- muted forest green

- warm ivory

- stone gray

- restrained bronze or weathered brass accents

Avoid:

- camouflage backgrounds

- bright orange hunting clichés

- antler-heavy branding

- cartoon animals

- cheap outdoor-store aesthetics

- neon colors

- excessive gradients

- glassmorphism everywhere

- overly futuristic science-fiction design

Typography should feel strong and editorial.

Use:

- a clean, readable sans-serif for the interface

- a restrained serif or distinctive display typeface only for major brand moments

- generous spacing

- clear hierarchy

- high contrast

- subtle borders

- minimal shadows

Create a simple Freki brand mark inspired by:

- intelligence

- direction

- tracks

- terrain

- a wolf

- Norse mythology

The mark should be abstract and minimal, not a detailed wolf illustration.

The product should feel closer to a premium intelligence dashboard than a recreational hunting blog.

==================================================

4. APPLICATION STRUCTURE

==================================================

Create these primary routes:

1. Landing page

2. Demo login / onboarding

3. Dashboard

4. Properties

5. Property overview

6. Property map

7. Property Brain

8. Trail Cameras

9. Sightings and Observations

10. Hunt Evaluation

11. Hunt History

12. Freki AI Assistant

13. Reports

14. Settings

Use a persistent desktop sidebar and a mobile bottom navigation or compact mobile menu.

Primary navigation should include:

- Overview

- Properties

- Map

- Cameras

- Observations

- Hunt Evaluation

- Freki AI

- Reports

Include a property selector near the top of the application.

==================================================

5. LANDING PAGE

==================================================

Create a polished marketing landing page.

Hero content:

Freki

“Know the property. Understand the conditions. Make the decision.”

Supporting message:

Freki turns property data, field observations, weather, wind, camera activity, habitat features, and hunting history into clear, evidence-backed intelligence.

Primary CTA:

“Explore the Demo”

Secondary CTA:

“See How It Works”

Include sections for:

- Property Brain

- Truth Score

- Hunt Evaluation

- Trail Camera Intelligence

- Evidence-backed recommendations

- Property-specific AI

- How Freki works

- Who Freki is for

Include a product screenshot-style dashboard preview.

Include a section explaining:

“Most hunting apps tell you what might happen. Freki explains why.”

Finish with a strong final CTA.

==================================================

6. DEMO ENTRY AND ONBOARDING

==================================================

Create a simple login screen with:

- Continue with email

- Continue with Google

- Explore demo property

The email and Google options can be visual placeholders in the first version.

The demo option must work immediately.

Create a short onboarding flow:

Step 1:

Choose the user’s main goal.

Options:

- Plan individual hunts

- Manage a hunting property

- Organize trail cameras

- Improve habitat

- Manage a hunting club

Step 2:

Choose primary species.

Include:

- Whitetail deer

- Turkey

- Elk

- Black bear

- Waterfowl

- Other

Use whitetail deer as the populated demo experience.

Step 3:

Add a property or open the sample property.

==================================================

7. SAMPLE PROPERTY

==================================================

Include one fully populated sample property named:

Black Ridge Farm

Property details:

- 286 acres

- Upstate New York

- Mixed hardwoods, agricultural fields, marsh edge, and early successional cover

- Primary species: whitetail deer

- 8 trail cameras

- 6 hunting stands

- 3 access routes

- 4 bedding zones

- 3 food sources

- 2 water sources

- 18 recent wildlife observations

Create realistic property notes and fictional data.

The sample property should make the product feel complete immediately.

==================================================

8. MAIN DASHBOARD

==================================================

Create a highly polished dashboard for Black Ridge Farm.

The dashboard should answer:

“What should I know right now?”

Include:

Current Hunt Outlook

- Overall score out of 100

- Recommended or not recommended

- Best estimated time window

- Suggested stand

- Confidence level

- Concise explanation

Example:

“Good evening opportunity near North Funnel Stand. A northwest wind protects the primary access route, recent daylight camera activity is above baseline, and falling pressure may increase movement. Confidence is moderate because camera coverage is limited on the eastern ridge.”

Include metric cards for:

- Wind

- Temperature

- Barometric pressure

- Moon illumination

- Recent camera activity

- Daylight activity

- Property disturbance

- Truth Score

Include sections for:

- Best stand today

- Areas to avoid

- Recent camera detections

- Latest observations

- Property alerts

- Upcoming weather windows

- Recent hunt results

- Freki’s current property hypothesis

Every score must include an explanation or expandable reasoning panel.

==================================================

9. PROPERTY BRAIN

==================================================

Property Brain is the central intelligence layer.

Create a dedicated page that organizes what Freki knows about the property.

Include these categories:

- Property profile

- Terrain

- Habitat

- Food

- Water

- Bedding

- Travel corridors

- Hunting pressure

- Human access

- Seasonal patterns

- Camera coverage

- Observations

- Known mature animals

- Uncertainty and missing information

Each item should show its evidence type:

- Confirmed

- Observed

- User-reported

- Inferred

- Predicted

- Unknown

Create a Property Knowledge panel with statements such as:

“Deer frequently use the northern field edge during the final hour of daylight.”

“South access may contaminate the central bedding area under a southwest wind.”

“The eastern ridge is under-observed because no cameras currently cover that area.”

Each statement should include:

- confidence percentage

- supporting evidence

- conflicting evidence

- last updated

- source count

- related map locations

Add controls to:

- Add observation

- Correct Freki

- Confirm a pattern

- Mark information as outdated

- Add a property note

==================================================

10. TRUTH SCORE

==================================================

Create a reusable Truth Score component.

Truth Score measures how well-supported a conclusion is.

Display:

- Score from 0 to 100

- Confidence label

- Evidence quality

- Evidence quantity

- Recency

- Coverage gaps

- Conflicting evidence

- Main uncertainty

Suggested confidence labels:

- 0–24: Speculative

- 25–49: Low confidence

- 50–69: Moderate confidence

- 70–84: Strong confidence

- 85–100: High confidence

Do not imply that Truth Score represents certainty.

Provide a detailed breakdown drawer or modal.

Example:

Truth Score: 74

Strong evidence:

- 11 recent camera detections

- 4 matching field observations

- Consistent wind-safe access

- Similar pattern observed during three previous cold fronts

Weaknesses:

- Eastern camera coverage is incomplete

- No recent observation from the lower creek crossing

Create visually distinct indicators for supporting and conflicting evidence without relying only on color.

==================================================

11. PROPERTY MAP

==================================================

Build a polished interactive property map experience.

The first version can use a custom illustrated terrain-style map or a map-like interface with sample property imagery. It must not require a paid map API.

Include togglable layers for:

- Property boundary

- Contours

- Habitat

- Food sources

- Water

- Bedding zones

- Travel corridors

- Hunting stands

- Trail cameras

- Access routes

- Wind direction

- Observations

- Pressure zones

- Predicted movement

Create markers for:

- stands

- cameras

- gates

- parking

- food plots

- bedding zones

- scrapes

- rubs

- sightings

- harvest locations

- hazards

Clicking a marker should open a detail panel.

Users should be able to:

- toggle layers

- filter marker types

- select a location

- add a new marker

- view marker details

- open related observations

- see wind impact

- see access risk

- view a simplified movement overlay

Use realistic example locations within Black Ridge Farm.

Include a “Map Intelligence” side panel that explains relevant patterns.

==================================================

12. TRAIL CAMERAS

==================================================

Create a Trail Cameras section.

Main camera overview should include:

- camera name

- location

- status

- battery

- storage or connection status

- last check

- last image

- detection count

- daylight activity

- target animal activity

Include eight sample cameras.

Example camera names:

- North Funnel

- Creek Crossing

- West Field

- East Ridge

- Marsh Edge

- Oak Bench

- South Gate

- Hidden Plot

Create a camera gallery with realistic placeholder wildlife imagery or well-designed image placeholders.

Gallery filters:

- Species

- Camera

- Date

- Time of day

- Daylight or nighttime

- Individual animal

- Confidence

- Temperature

- Wind direction

Image cards should show:

- timestamp

- camera

- species

- confidence

- temperature

- wind

- moon

- tags

Create a camera detail page showing:

- activity timeline

- hourly detections

- species breakdown

- daylight activity trend

- recent images

- camera notes

- nearby map features

Add an upload flow that accepts image selection and shows a mock processing sequence:

- Uploading

- Reading metadata

- Detecting species

- Checking known animals

- Adding environmental context

- Complete

==================================================

13. OBSERVATIONS

==================================================

Create a field observation log.

Observation types:

- Sighting

- Track

- Rub

- Scrape

- Vocalization

- Bedding evidence

- Feeding evidence

- Harvest

- Human pressure

- Predator

- Weather event

- Property work

- Other

Observation form fields:

- Date and time

- Location

- Observation type

- Species

- Number observed

- Direction of travel

- Behavior

- Weather

- Wind

- Notes

- Photos

- Confidence

- Share with Property Brain

Display observations in:

- list view

- timeline view

- map view

Add filters and search.

==================================================

14. HUNT EVALUATION

==================================================

Create one of the strongest and most polished pages in the product.

The Hunt Evaluation page should allow users to evaluate a planned hunt.

Inputs:

- Property

- Date

- Start time

- End time

- Target species

- Hunting stand or location

- Planned access route

- Expected wind

- Recent property pressure

- Optional notes

Output:

- Overall Hunt Score from 0 to 100

- Truth Score

- Recommendation

- Best time window

- Access risk

- Wind risk

- Bedding disturbance risk

- Recent activity

- Weather impact

- Historical performance

- Main positive factors

- Main negative factors

- Unknown factors

- Alternative stand suggestions

The result should include a clear written explanation.

Example:

“North Funnel is a strong option for the final 90 minutes of daylight. The northwest wind carries scent away from the primary bedding zone, and daylight buck activity has increased over the last four days. The main concern is that the access route passes within 110 yards of the marsh bedding edge. Entering earlier may reduce the chance of disturbing deer already staged nearby.”

Include sections titled:

- Why this could work

- What could go wrong

- What Freki does not know

- Better alternatives

- How to improve confidence

Add a “Compare Locations” function for up to three stands.

==================================================

15. HUNT HISTORY

==================================================

Create a hunt journal.

Each hunt record should include:

- date

- property

- location

- entry and exit times

- wind

- weather

- observations

- animals encountered

- shots

- harvest

- pressure created

- notes

- photos

- original Hunt Score

- actual outcome

Create a post-hunt review:

- What happened?

- Was Freki’s recommendation accurate?

- Were there unexpected conditions?

- Was the access route clean?

- Did animal movement match expectations?

- What should Freki learn?

Show patterns such as:

- Most productive wind

- Most productive stand

- Average sightings by temperature

- Morning versus evening performance

- Score accuracy over time

Clearly label demo insights as sample data.

==================================================

16. FREKI AI ASSISTANT

==================================================

Create an AI assistant interface named:

Ask Freki

The assistant should feel like a property analyst, not a generic chatbot.

Suggested prompts:

- Where should I hunt tomorrow evening?

- Which cameras are showing the most daylight activity?

- What is the safest access route with a southwest wind?

- What does Freki know about the eastern ridge?

- Which conclusions have weak evidence?

- What information should I collect next?

- Compare North Funnel and Oak Bench.

- How has hunting pressure affected movement?

For the first version, provide intelligent mock responses based on the sample property.

Every response should include:

- concise answer

- reasoning

- supporting evidence

- conflicting evidence

- confidence

- recommended next action

- links to relevant property records

Include a visible note:

“Freki provides decision support, not certainty. Wildlife behavior is inherently variable.”

==================================================

17. REPORTS

==================================================

Create a reports area.

Include report types:

- Weekly Property Intelligence Brief

- Trail Camera Activity Report

- Hunt Performance Report

- Property Knowledge Gaps

- Seasonal Movement Summary

- Stand Performance Report

- Habitat and Access Risk Report

Create a polished sample Weekly Property Intelligence Brief.

It should include:

- executive summary

- current property patterns

- top opportunities

- major risks

- camera activity

- recent observations

- confidence changes

- information gaps

- recommended field actions

Include visual buttons for:

- Generate report

- Export PDF

- Share

- Print

The first version can show simulated behavior for export and sharing.

==================================================

18. SETTINGS

==================================================

Create settings sections for:

- Account

- Profile

- Notifications

- Units

- Default species

- Properties

- Data and privacy

- AI preferences

- Connected services

- Subscription

- Team members

Include unit choices:

- Fahrenheit / Celsius

- Acres / hectares

- Miles / kilometers

- Inches / millimeters

Create placeholders for future integrations:

- Weather provider

- Mapping provider

- Cellular trail cameras

- Email reports

- SMS alerts

- Calendar

- Supabase

Clearly label integrations as “Coming later” rather than making them appear broken.

==================================================

19. SAMPLE DATA REQUIREMENTS

==================================================

Populate the app with coherent fictional data.

Do not use random numbers that contradict one another.

Ensure relationships make sense.

Examples:

- A camera near North Funnel should support North Funnel movement conclusions.

- A southwest wind should affect scent and access differently from a northwest wind.

- Hunting pressure should influence subsequent activity.

- Recent cold-front activity should appear consistently across the dashboard, cameras, evaluation, and AI responses.

- Knowledge gaps should be reflected in lower Truth Scores.

- Post-hunt outcomes should influence Property Brain conclusions.

Create sample:

- properties

- stands

- cameras

- observations

- camera detections

- weather snapshots

- hunt evaluations

- hunt records

- Property Brain statements

- reports

- AI responses

==================================================

20. RESPONSIVE REQUIREMENTS

==================================================

The app must work well at:

- large desktop widths

- laptop widths

- tablet widths

- modern mobile phone widths

On mobile:

- avoid cramped tables

- convert data tables into cards

- use bottom sheets where appropriate

- keep primary actions easy to reach

- ensure maps and filters remain usable

- avoid horizontal overflow

- use touch-friendly targets

- keep navigation clear

==================================================

21. ACCESSIBILITY

==================================================

Use:

- semantic HTML

- keyboard-accessible navigation

- visible focus states

- readable contrast

- meaningful labels

- descriptive button names

- accessible dialogs

- text labels in addition to color

- alt text for meaningful imagery

==================================================

22. QUALITY CONTROL

==================================================

Before considering the build complete:

- Verify every route loads.

- Verify primary navigation works.

- Verify the demo entry works.

- Verify dialogs can open and close.

- Verify filters visibly change displayed data.

- Verify forms provide success feedback.

- Verify mobile navigation works.

- Verify there are no blank pages.

- Verify no page requires an API key.

- Verify there are no obvious console errors.

- Verify no buttons falsely imply that a real integration is connected.

- Verify sample data is consistent throughout the app.

- Verify the branding consistently says Freki.

- Verify the tagline is “We give you the why.”

- Verify every major recommendation includes reasoning and uncertainty.

==================================================

23. BUILD PRIORITY

==================================================

Build in this order:

1. Application shell and design system

2. Landing page and demo entry

3. Main dashboard

4. Property overview and Property Brain

5. Property map

6. Trail Cameras

7. Observations

8. Hunt Evaluation

9. Hunt History

10. Ask Freki

11. Reports

12. Settings

13. Responsive and accessibility pass

14. Final reliability and consistency pass

Do not sacrifice stability to generate every feature simultaneously.

The final result should look and behave like a credible early-stage SaaS product suitable for demonstrating to hunters, landowners, investors, designers, and potential development partners.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/cb00a6f2-4e53-447c-9f2f-57194589aadb).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
