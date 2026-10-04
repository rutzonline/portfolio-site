export type AboutExtra = {
  bio: string
  languages: [string, string][]
  interests: string[]
  faqs: [string, string][]
}

export const aboutContent: Record<"growth" | "brand", AboutExtra> = {
  growth: {
    bio: "also a pop culture enthusiast, an avid sports fan, and a daily puzzle solver who's very selectively chronically online.",
    languages: [
      ["english", "fluent"],
      ["hindi", "native"],
      ["marathi", "native"],
    ],
    interests: ["growth loops", "pricing & positioning", "sports", "pop culture", "daily puzzles"],
    faqs: [
      ["what kind of growth work do you do?", "early-stage product growth: activation, lifecycle, paid and creator experiments, plus the reporting that tells you what actually moved."],
      ["what stage of company do you work best with?", "seed to series a, where one person can still touch positioning, channels and measurement."],
      ["how do you pick what to test first?", "i score ideas on impact, confidence and effort, then start with the cheapest test that could change the plan."],
      ["which tools do you rely on?", "posthog, google analytics, clay, mailchimp and shopify, plus whatever lets me ship faster."],
      ["are you open to full-time roles?", "yes, i'm aspiring toward a product marketing / growth manager role, and still take select freelance projects."],
      ["how can we work together?", "book a call or send an email from the contact card. i reply within a couple of days."],
    ],
  },
  brand: {
    bio: "also a pop culture enthusiast, an avid sports fan, and a daily puzzle solver who's very selectively chronically online.",
    languages: [
      ["english", "writes in it, daily"],
      ["hindi", "native"],
      ["marathi", "native"],
    ],
    interests: ["storytelling", "brand voice", "newsletters", "pop culture", "sports", "daily puzzles"],
    faqs: [
      ["what do you write?", "product narratives, brand voice, lifecycle emails, essays and social copy."],
      ["do you work with founders directly?", "yes, most of my freelance work is with founders who need a clear voice fast."],
      ["how do you find a brand's voice?", "i listen first: customer calls, support threads and the founder's rambling voice notes, then draft in that register."],
      ["what's your editing process?", "outline, rough draft, a cold read the next day, then cut by a third."],
      ["which writers or brands inspire you?", "anything that sounds like a person wrote it. i keep a running list on the moodboard."],
      ["how can we work together?", "book a call or send an email from the contact card. i reply within a couple of days."],
    ],
  },
}
