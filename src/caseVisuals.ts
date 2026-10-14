type CaseVisual = { src: string; alt: string; caption: string; source?: string }
const visuals: Record<string, CaseVisual> = {
  "wispr|the brief": {
    "src": "/case-images/wispr-workspace.webp",
    "alt": "Wispr Flow in a workspace",
    "caption": "Wispr Flow · official desktop product demonstration",
    "source": "https://wisprflow.ai/india"
  },
  "wispr|market and product reality": {
    "src": "/case-images/wispr-india.webp",
    "alt": "Official Wispr Flow India campaign artwork",
    "caption": "Official Wispr Flow India campaign artwork",
    "source": "https://wisprflow.ai/india"
  },
  "wispr|launch plan": {
    "src": "/case-images/wispr-product.webp",
    "alt": "Wispr Flow · official campaign photography",
    "caption": "Wispr Flow · official campaign photography",
    "source": "https://wisprflow.ai/india"
  },
  "wispr|first 100 users": {
    "src": "/case-images/wispr-mobile.webp",
    "alt": "Wispr Flow · official mobile dictation demonstration",
    "caption": "Wispr Flow · official mobile dictation demonstration",
    "source": "https://wisprflow.ai/india"
  },
  "wispr|growth loops": {
    "src": "/case-images/wispr-ideas.webp",
    "alt": "Wispr Flow mobile product demonstration",
    "caption": "Wispr Flow · official mobile product demonstration",
    "source": "https://wisprflow.ai/india"
  },
  "wispr|distribution channels": {
    "src": "/case-images/wispr-india.webp",
    "alt": "Official Wispr Flow India campaign artwork",
    "caption": "Official Wispr Flow India campaign artwork",
    "source": "https://wisprflow.ai/india"
  },
  "wispr|risks and mitigations": {
    "src": "/case-images/wispr-workspace.webp",
    "alt": "Wispr Flow in a workspace",
    "caption": "Wispr Flow · official desktop product demonstration",
    "source": "https://wisprflow.ai/india"
  },
  "wispr|success metrics": {
    "src": "/case-images/wispr-mobile.webp",
    "alt": "Wispr Flow · official mobile dictation demonstration",
    "caption": "Wispr Flow · official mobile dictation demonstration",
    "source": "https://wisprflow.ai/india"
  },
  "cursor|the growth problem": {
    "src": "/case-images/cursor-product.webp",
    "source": "https://cursor.com/",
    "caption": "Cursor · official website product demonstration",
    "alt": "Cursor · official website product demonstration"
  },
  "cursor|evidence and audience": {
    "src": "/case-images/cursor-students.webp",
    "source": "https://cursor.com/students",
    "caption": "Cursor · official student-programme page",
    "alt": "Cursor · official student-programme page"
  },
  "cursor|partners and the work they would do": {
    "src": "/case-images/cursor-workshop.webp",
    "alt": "Campus workshop photo from Cursor",
    "caption": "Campus workshop photo from Cursor",
    "source": "https://cursor.com/campus-leads"
  },
  "cursor|pilot mechanics": {
    "src": "/case-images/cursor-build-night.webp",
    "alt": "Student build event photo from Cursor",
    "caption": "Student build event photo from Cursor",
    "source": "https://cursor.com/campus-leads"
  },
  "cursor|economics and decisions": {
    "src": "/case-images/cursor-demo.webp",
    "alt": "Campus teaching session photo from Cursor",
    "caption": "Campus teaching session photo from Cursor",
    "source": "https://cursor.com/campus-leads"
  },
  "revolut|the growth problem": {
    "src": "/case-images/revolut-audi.webp",
    "alt": "Official Revolut Audi F1 partnership artwork",
    "caption": "Revolut · official Audi F1 partnership artwork",
    "source": "https://www.revolut.com/en-IN/news/revolut_becomes_title_partner_of_the_future_audi_f1_team/"
  },
  "revolut|choose audiences by payment task": {
    "src": "/case-images/revolut-ui-1.webp",
    "source": "https://www.revolut.com/en-IN/",
    "caption": "Revolut · official overseas-payment product artwork",
    "alt": "Revolut · official overseas-payment product artwork"
  },
  "revolut|partnership briefs": {
    "src": "/case-images/revolut-city.webp",
    "alt": "Official Revolut and Manchester City partnership photograph",
    "caption": "Official Revolut and Manchester City partnership photograph",
    "source": "https://www.revolut.com/en-IN/news/revolut_becomes_a_global_partner_and_official_back_of_shirt_partner_of_manchester_city_men_s_and_women_s_first_teams/"
  },
  "revolut|journey, measurement and constraints": {
    "src": "/case-images/revolut-ui-3.webp",
    "source": "https://www.revolut.com/en-IN/",
    "caption": "Revolut · official product artwork",
    "alt": "Revolut · official product artwork"
  },
  "revolut|pilot budget and stop rules": {
    "src": "/case-images/revolut-audi.webp",
    "alt": "Official Revolut Audi F1 partnership artwork",
    "caption": "Revolut · official Audi F1 partnership artwork",
    "source": "https://www.revolut.com/en-IN/news/revolut_becomes_title_partner_of_the_future_audi_f1_team/"
  },
  "heyclicky|the product and acquisition problem": {
    "src": "/case-images/heyclicky-site.webp",
    "source": "https://www.heyclicky.com/",
    "caption": "Heyclicky · official website screenshot",
    "alt": "Heyclicky · official website screenshot"
  },
  "heyclicky|creative direction": {
    "src": "/case-images/heyclicky-help.webp",
    "alt": "HeyClicky living in the Mac notch",
    "caption": "HeyClicky living in the Mac notch",
    "source": "https://www.heyclicky.com/changelog"
  },
  "heyclicky|creator and distribution choices": {
    "src": "/case-images/heyclicky-referrals.webp",
    "alt": "The Invite & earn page: a heyclicky.com/@username link with Copy link and Copy code buttons, the 25% terms, and the people you've invited",
    "caption": "The Invite & earn page: a heyclicky.com/@username link with Copy link and Copy code buttons, the 25% terms, and the people you've invited",
    "source": "https://www.heyclicky.com/changelog"
  },
  "heyclicky|landing page and first use": {
    "src": "/case-images/heyclicky-onboarding.webp",
    "alt": "The hands-on onboarding tutorial guiding a new user through their first interactions",
    "caption": "The hands-on onboarding tutorial guiding a new user through their first interactions",
    "source": "https://www.heyclicky.com/changelog"
  },
  "heyclicky|experiment and economics": {
    "src": "/case-images/heyclicky-plans.webp",
    "alt": "The upgrade paywall with a yearly toggle showing 20% off Pro and Max",
    "caption": "The upgrade paywall with a yearly toggle showing 20% off Pro and Max",
    "source": "https://www.heyclicky.com/changelog"
  },
  "stateplate|case study": {
    "src": "/case-images/stateplate-brand.webp",
    "alt": "Official The State Plate storefront banner",
    "caption": "Official The State Plate storefront banner",
    "source": "https://thestateplate.com/"
  },
  "stateplate|results at a glance": {
    "src": "/case-images/stateplate-products.webp",
    "alt": "Regional food selection from The State Plate",
    "caption": "Regional food selection from The State Plate",
    "source": "https://thestateplate.com/"
  },
  "stateplate|approach": {
    "src": "/case-images/stateplate-products.webp",
    "alt": "Regional food selection from The State Plate",
    "caption": "Regional food selection from The State Plate",
    "source": "https://thestateplate.com/"
  },
  "stateplate|what i did": {
    "src": "/case-images/stateplate-brand.webp",
    "alt": "Official The State Plate storefront banner",
    "caption": "Official The State Plate storefront banner",
    "source": "https://thestateplate.com/"
  },
  "stateplate|results": {
    "src": "/case-images/stateplate-products.webp",
    "alt": "Regional food selection from The State Plate",
    "caption": "Regional food selection from The State Plate",
    "source": "https://thestateplate.com/"
  },

}

export function getCaseVisual(md: string, section: string): CaseVisual | null {
  const key = md.includes("# Cursor:") ? "cursor" : md.includes("# Revolut:") ? "revolut" : md.includes("# Heyclicky:") ? "heyclicky" : md.includes("Market and Product Reality") ? "wispr" : md.includes("Turning Near-Expiry Stock") ? "stateplate" : md.includes("Independent since 2025") ? "freelance" : md.includes("warehouse-tech startup") ? "hopstack" : md.includes("investing platform") ? "liquide" : null
  if (key === "liquide") return null
  return key ? visuals[`${key}|${section.toLowerCase()}`] ?? null : null
}
