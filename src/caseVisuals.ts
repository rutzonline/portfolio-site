import liquideWork from "@/imports/liquide/l1.jpg"

type CaseVisual = { src: string; alt: string; caption: string }
const visuals: Record<string, CaseVisual> = {
  "wispr|the brief": {
    "src": "/case-visuals/wispr-the-brief.svg",
    "alt": "From voice note to readable reply. An India-first receiving-side workflow, with a hand-off to Wispr Flow.",
    "caption": "Conceptual campaign visual · from voice note to readable reply"
  },
  "wispr|market and product reality": {
    "src": "/case-visuals/wispr-market-and-product-reality.svg",
    "alt": "A useful wedge, not another transcript. Focus on the situations where a generic transcript falls short.",
    "caption": "Conceptual campaign visual · a useful wedge, not another transcript"
  },
  "wispr|launch plan": {
    "src": "/case-visuals/wispr-launch-plan.svg",
    "alt": "Launch, learn, then distribute. The rollout follows the proposed day-one, week-one and month-one sequence.",
    "caption": "Conceptual campaign visual · launch, learn, then distribute"
  },
  "wispr|first 100 users": {
    "src": "/case-visuals/wispr-first-100-users.svg",
    "alt": "The first 100, channel by channel. Proposed acquisition targets for the first 7–10 days.",
    "caption": "Conceptual campaign visual · the first 100, channel by channel"
  },
  "wispr|growth loops": {
    "src": "/case-visuals/wispr-growth-loops.svg",
    "alt": "A transcript that travels. Referral mechanisms to test after users experience the core value.",
    "caption": "Conceptual campaign visual · a transcript that travels"
  },
  "wispr|distribution channels": {
    "src": "/case-visuals/wispr-distribution-channels.svg",
    "alt": "Different channels, different horizons. Sequence distribution around learning speed and repeatable demand.",
    "caption": "Conceptual campaign visual · different channels, different horizons"
  },
  "wispr|risks and mitigations": {
    "src": "/case-visuals/wispr-risks-and-mitigations.svg",
    "alt": "Keep the bot useful and sustainable. Guardrails belong in the product and acquisition plan together.",
    "caption": "Conceptual campaign visual · keep the bot useful and sustainable"
  },
  "wispr|success metrics": {
    "src": "/case-visuals/wispr-success-metrics.svg",
    "alt": "Measure notes, not just downloads. Milestones are proposed targets, rather than observed campaign results.",
    "caption": "Conceptual campaign visual · measure notes, not just downloads"
  },
  "cursor|the growth problem": {
    "src": "/case-visuals/cursor-the-growth-problem.svg",
    "alt": "Beyond the first prototype. The campus proposal tests support that helps students return to a real project.",
    "caption": "Conceptual campaign visual · beyond the first prototype"
  },
  "cursor|evidence and audience": {
    "src": "/case-visuals/cursor-evidence-and-audience.svg",
    "alt": "Recruit for a project, not a certificate. The proposed audience combines basic coding skills with a reason to build.",
    "caption": "Conceptual campaign visual · recruit for a project, not a certificate"
  },
  "cursor|partners and the work they would do": {
    "src": "/case-visuals/cursor-partners-and-the-work-they-would-do.svg",
    "alt": "Give each partner a concrete job. Prospective roles in a campus cohort; no partnership is implied.",
    "caption": "Conceptual campaign visual · give each partner a concrete job"
  },
  "cursor|pilot mechanics": {
    "src": "/case-visuals/cursor-pilot-mechanics.svg",
    "alt": "A build that survives the workshop. A proposed campus cohort organised around feedback and repeat use.",
    "caption": "Conceptual campaign visual · a build that survives the workshop"
  },
  "cursor|economics and decisions": {
    "src": "/case-visuals/cursor-economics-and-decisions.svg",
    "alt": "A ₹3 lakh learning pilot. Budget allocations to quote against before committing to a cohort.",
    "caption": "Conceptual campaign visual · a ₹3 lakh learning pilot"
  },
  "revolut|the growth problem": {
    "src": "/case-visuals/revolut-the-growth-problem.svg",
    "alt": "Fan attention needs a payment task. The proposal separates two different reasons to use the product.",
    "caption": "Conceptual campaign visual · fan attention needs a payment task"
  },
  "revolut|choose audiences by payment task": {
    "src": "/case-visuals/revolut-choose-audiences-by-payment-task.svg",
    "alt": "Qualify the journey before the fan. Audience selection depends on an upcoming task and supported product access.",
    "caption": "Conceptual campaign visual · qualify the journey before the fan"
  },
  "revolut|partnership briefs": {
    "src": "/case-visuals/revolut-partnership-briefs.svg",
    "alt": "A brief built around the host’s work. Prospective partners supply useful context rather than an implied endorsement.",
    "caption": "Conceptual campaign visual · a brief built around the host’s work"
  },
  "revolut|journey, measurement and constraints": {
    "src": "/case-visuals/revolut-journey-measurement-and-constraints.svg",
    "alt": "From relevant intent to repeat use. Measure each stage against its eligible cohort, not total impressions.",
    "caption": "Conceptual campaign visual · from relevant intent to repeat use"
  },
  "revolut|pilot budget and stop rules": {
    "src": "/case-visuals/revolut-pilot-budget-and-stop-rules.svg",
    "alt": "A ₹5 lakh pilot ceiling. Planning allocations; rights and travel need separate quotes.",
    "caption": "Conceptual campaign visual · a ₹5 lakh pilot ceiling"
  },
  "heyclicky|the product and acquisition problem": {
    "src": "/case-visuals/heyclicky-the-product-and-acquisition-problem.svg",
    "alt": "Make the help understandable. The first test centres on one beginner editing task, then repeat use.",
    "caption": "Conceptual campaign visual · make the help understandable"
  },
  "heyclicky|creative direction": {
    "src": "/case-visuals/heyclicky-creative-direction.svg",
    "alt": "One editing task, shown clearly. A proposed 30-second production storyboard, not a product screenshot.",
    "caption": "Conceptual campaign visual · one editing task, shown clearly"
  },
  "heyclicky|creator and distribution choices": {
    "src": "/case-visuals/heyclicky-creator-and-distribution-choices.svg",
    "alt": "Teaching is the creative brief. Select task-relevant educators and separate production from distribution.",
    "caption": "Conceptual campaign visual · teaching is the creative brief"
  },
  "heyclicky|landing page and first use": {
    "src": "/case-visuals/heyclicky-landing-page-and-first-use.svg",
    "alt": "Keep the promise through install. Match the ad task to the page, permissions and first-use experience.",
    "caption": "Conceptual campaign visual · keep the promise through install"
  },
  "heyclicky|experiment and economics": {
    "src": "/case-visuals/heyclicky-experiment-and-economics.svg",
    "alt": "A $12,000 test, before scale. Proposed 60-day allocations; use retention and contribution to set the ceiling.",
    "caption": "Conceptual campaign visual · a $12,000 test, before scale"
  },
  "stateplate|case study": {
    "src": "/case-visuals/stateplate-case-study.svg",
    "alt": "Regional food, connected channels. A visual summary of the reported app, email and offline growth work.",
    "caption": "Reported work · regional food, connected channels"
  },
  "stateplate|results at a glance": {
    "src": "/case-visuals/stateplate-results-at-a-glance.svg",
    "alt": "The reported growth outcomes. Figures summarised from the case study, rather than a fabricated dashboard.",
    "caption": "Reported work · the reported growth outcomes"
  },
  "stateplate|challenge": {
    "src": "/case-visuals/stateplate-challenge.svg",
    "alt": "Growth blockers across the journey. App adoption, email health and at-risk stock needed a coordinated response.",
    "caption": "Reported work · growth blockers across the journey"
  },
  "stateplate|approach": {
    "src": "/case-visuals/stateplate-approach.svg",
    "alt": "Fix the experience before scaling. Turn an operational constraint into a discovery and owned-channel opportunity.",
    "caption": "Reported work · fix the experience before scaling"
  },
  "stateplate|what i did": {
    "src": "/case-visuals/stateplate-what-i-did.svg",
    "alt": "Sampling became a growth entry point. The reported inventory-to-customer journey connects offline and digital work.",
    "caption": "Reported work · sampling became a growth entry point"
  },
  "stateplate|results": {
    "src": "/case-visuals/stateplate-results.svg",
    "alt": "Better adoption and purchase value. Selected before-and-after figures reported in the case study.",
    "caption": "Reported work · better adoption and purchase value"
  },
  "freelance|overview": {
    "src": "/case-visuals/freelance-overview.svg",
    "alt": "From positioning to a content system. Independent work with early-stage founders and small teams.",
    "caption": "Reported work · from positioning to a content system"
  },
  "freelance|what i worked on": {
    "src": "/case-visuals/freelance-what-i-worked-on.svg",
    "alt": "Campaigns with a practical output. A scope summary of the freelance marketing work described here.",
    "caption": "Reported work · campaigns with a practical output"
  },
  "hopstack|overview": {
    "src": "/case-visuals/hopstack-overview.svg",
    "alt": "Explain the warehouse product clearly. A visual summary of the B2B content, CMS and SEO internship.",
    "caption": "Reported work · explain the warehouse product clearly"
  },
  "hopstack|what i worked on": {
    "src": "/case-visuals/hopstack-what-i-worked-on.svg",
    "alt": "Content across the B2B journey. The work combined explainers, organic discovery and event support.",
    "caption": "Reported work · content across the b2b journey"
  }
}

export function getCaseVisual(md: string, section: string): CaseVisual | null {
  const key = md.includes("# Cursor:") ? "cursor" : md.includes("# Revolut:") ? "revolut" : md.includes("# Heyclicky:") ? "heyclicky" : md.includes("Market and Product Reality") ? "wispr" : md.includes("Turning Near-Expiry Stock") ? "stateplate" : md.includes("Independent since 2025") ? "freelance" : md.includes("warehouse-tech startup") ? "hopstack" : md.includes("investing platform") ? "liquide" : null
  if (key === "liquide") return { src: liquideWork, alt: "Original social content created during the Liquide internship", caption: "Liquide · original social content" }
  return key ? visuals[`${key}|${section.toLowerCase()}`] ?? null : null
}
