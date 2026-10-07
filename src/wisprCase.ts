export const wisprCase = String.raw`## 01. The Brief

**Problem:** Voice notes are everywhere in India, but they create friction for the receiver. You need a quiet space; you have to listen fully, re-listen sometimes, and only then reply.

**Constraints:** 1–2 engineers. No large paid marketing budget. Distribution, not branding.

**Questions to answer**
1. What to do on Day 1, Week 1, and Month 1
2. How to get the first 100 users
3. How to make it spread aggressively

---

## 02. Market and Product Reality

**Demand**
- India is WhatsApp's largest market, with an estimated 535 million users.
- WhatsApp has reported about 7 billion voice messages sent per day worldwide.

**Competition**
- WhatsApp already ships voice transcripts. They are generated on the device and are not automatic: the user must turn the feature on and tap "transcribe" on each message. Hindi has no official support.
- Free transcription bots already exist. Transcriber gives 15 free minutes a week. Transcribbit gives 3 free minutes a day. Speechnotes is fully free. All position as generic and global, not India-first.

**Wispr Flow in India**
- India is Wispr Flow's second-largest market. Growth ran about 60% month over month before its India campaign and about 100% after it.
- The campaign included 100 branded auto-rickshaws in Bengaluru.
- India is 14% of Wispr Flow's global downloads but only 2% of in-app revenue. India pricing starts at ₹320 a month on annual plans.

**Platform constraints**
- Meta bars general-purpose AI assistants from the WhatsApp Business API (from 15 Jan 2026) but allows defined-function bots such as support and bookings.
- From 1 Oct 2026, India service replies cost ₹0.115 after 1,000 free per number per month. Marketing templates cost ₹0.8631.

**What this means for the plan**
1. **Transcription alone is not a wedge.** The wedge is zero-setup forwarding, Hinglish accuracy, and summaries for long notes.
2. **The bot is a free entry point for Wispr Flow.** The bot serves the receiving side of a voice note. Wispr Flow serves the sending side (speak, get clean text). Every transcript ends with a hand-off to Wispr Flow.
3. **Stay single-purpose.** No open-ended chat, so the bot stays inside Meta's rules.
4. **Free needs a cap.** At 3 notes a day, one active user costs about ₹10 a month in Meta fees alone (90 replies × ₹0.115, my estimate, excluding transcription and provider fees). One reply per note, and a free-tier limit.

**Positioning:** Forward a voice note. Read it in seconds. Hinglish included.

---

## 03. Launch Plan
*Answers question 1*

**Day 1: Launch**
- Test with the team on 50 real voice notes: English, Hinglish, noisy, and 3+ minutes
- Create one wa.me link and QR code per channel, each with a prefilled code (for example ` + "`?text=hi-reddit`" + String.raw`) so every user is attributed to a source
- Soft launch to 20 contacts (friends, founders, startup operators, sales)
- Check functionality only: delivery rate and reply speed
- Collect feedback

**Week 1: Expand**
- Review every failed transcription and log Hinglish errors
- Fix Day 1 bugs
- Publish a Hinglish accuracy test on X: WhatsApp's native transcript vs this bot vs two competitors
- Expand to 50–100 users via WhatsApp Status, startup and community groups, and X
- Start commenting on Reddit and Grapevine (first posts in Week 2)
- **Gate to scale:** at least 50% of Day 1 testers send a second note within 48 hours, and Hinglish complaints stay under 30% (targets)

**Month 1: Scale**
- Reach 500–1K users through word of mouth and organic posts
- Track activation, DAU, notes per user, 7-day retention, and viral coefficient
- Interview 10 power users (10+ notes a day)
- Reply to "voice note frustration" posts on X, Reddit, and Grapevine

---

## 04. First 100 Users
*Answers question 2. Timeline: 7–10 days. Targets are planning assumptions.*

| Channel | Play | Target |
|---|---|---|
| Personal network | DM 30 people. Ask each to forward one real voice note. | 25 |
| Groups | Startup WhatsApp groups, Slack/Discord communities, alumni and coworking groups. Post a demo clip and the number. | 30 |
| X | Hinglish accuracy test video. Reply to voice-note complaints. | 15 |
| Reddit and Grapevine | Story posts and comments (see section 06) | 10 |
| Direct outreach | 10 B2B sales reps on LinkedIn. Ask them to share in team groups. | 15 |
| Offline pilot | QR codes at 3 coworking spaces and cafes (Third Wave, Blue Tokai) | 5 |

---

## 05. Growth Loops
*Answers question 3*

1. **Footer link:** Every transcript ends with "Transcribed by [Bot Name]. Save time on voice notes: wa.me/[number]". When a user pastes a transcript into a group, the whole group sees the footer. Each footer carries a referral code to track the viral coefficient.
2. **Share prompt:** After 10 transcriptions: "You've saved [X] minutes. Share this with someone who'd benefit?" Triggered automatically.
3. **Status nudge:** After 3 uses, offer a pre-written WhatsApp Status: "I just found a bot that transcribes voice notes instantly: [link]". WhatsApp's Updates tab reaches about 1.5 billion people a day.
4. **Power user referrals:** DM the top 10 users by volume. Offer early premium access for 5 referrals, tracked by referral code.
5. **Wispr Flow hand-off:** After a transcript, offer "Reply without typing" with a link to Wispr Flow on Android. This turns a free bot into a paid-product funnel.
6. **Precedent:** Luzia, a WhatsApp assistant, grew mainly because users shared its contact with friends, reaching 17 million users by 2023. Its general-purpose scope later put it in the path of Meta's chatbot ban, which is why this bot stays single-purpose.

---

## 06. Distribution Channels

**Fast (Week 1–2)**
- Personal network and WhatsApp groups
- Startup communities (GrowthX, YC India, Surge alumni). GrowthX is a private, invite-only community of founders and growth leaders, so it is small but dense.
- **Grapevine:** 400K+ Indian professionals use it weekly, and members join private groups for their company. Good for sales and tech teams.
- **X:** founder-style demo video and the accuracy test. Wispr's own India launch was led by a founder video.

**Medium (Week 3–4)**
- **Reddit story posts.** Sizes vary by tracker:
- r/developersIndia: 1M+ members. Angle: "I tested 5 tools on 50 Hinglish voice notes."
- r/StartUpIndia: about 444K members. Angle: voice-note pain for founders and sales teams.
- r/indianstartups: about 128K members. Same angle, posted once.
- r/bangalore and r/india: comment only, no promotion.
- Rules: read a subreddit for two weeks before posting, disclose your affiliation, keep self-promotion to about 10% of activity, and post original content at most once a week across all subreddits.
- QR codes at coworking spaces and cafes. Scale only if the pilot converts.
- Partnerships with micro tech and productivity creators on Instagram and YouTube

**Slow but scalable (Month 2+)**
- SEO/AEO pages for: "WhatsApp voice note to text", "Hinglish voice note to text", "read WhatsApp voice message without listening"
- Partnerships with growth communities and b-schools (GrowthX, Mesa)
- Newsletter embeds and podcast plugs

---

## 07. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| **WhatsApp's native transcripts** | Win on Hinglish, zero setup, and summaries. Run the public accuracy test as proof. |
| **Hinglish accuracy** | Ship Hinglish in v1 using Wispr's existing model. Label it beta. Pause acquisition pushes if complaints exceed 30%. |
| **Privacy concerns** | "We don't store audio. Audio is deleted after transcription." Make this claim true in the build, and repeat it everywhere. |
| **WhatsApp blocks the number or limits the bot** | Official Business API from Day 1. Single-purpose scope. Rate-limit usage. |
| **Rising message costs** | One reply per note. Cap the free tier. Add the weekly "time saved" line to the next reply instead of sending a paid template. |
| **Users drop off** | Weekly "You saved X minutes" line, plus a prompt to try the Wispr Flow reply hand-off. |
| **No viral spread** | Referral codes on every footer and status template. Review K weekly. Cut loops that don't convert. |
| **Reddit removals** | Story and data posts, disclosed affiliation, comments before posts. |

---

## 08. Success Metrics

**North star:** Daily voice notes transcribed (usage, not downloads)

**Input metrics:** Activation (second note within 48 hours), notes per active user, viral coefficient, cost per active user, bot-to-Wispr Flow conversion

**Benchmark:** For consumer products, a viral coefficient of 0.15–0.25 is considered good, 0.4 great, and about 0.7 outstanding. Sustained values above 1 are rare.

| Milestone | Goal | Targets |
|---|---|---|
| **Week 1: Early traction** | **100 users** | 20% daily active, 3+ notes per active user, 50% activation |
| **Month 1: Loops working** | **1K users** | Viral coefficient ≥ 0.25, 30% 7-day retention |
| **Month 3: Scale and monetise** | **10K users** | Viral coefficient ≥ 0.4, 40% 30-day retention (stretch). Find the top 3 use cases (sales teams, founders, parents). Convert bot users to Wispr Flow as the monetisation path. |

---

## Sources
- TechCrunch, "Voice AI in India is hard — Wispr Flow is betting on it anyway" (May 2026)
- Dealroom and NewsBytes coverage of Wispr Flow's India launch (2026)
- TechCrunch, WhatsApp bars general-purpose chatbots (Oct 2025); dig.watch on the Business API terms
- Business Standard and TechCrunch coverage of WhatsApp voice transcripts (2024–2025)
- Flowcall and AiSensy, WhatsApp Business API India pricing (Oct 2026)
- Subreddit trackers: reddapi, GitHub (developersIndia), and an Indian-startup Reddit guide (May 2026)
- Grapevine and GrowthX company pages
- Viral coefficient benchmarks, shno.co (2026)
`
