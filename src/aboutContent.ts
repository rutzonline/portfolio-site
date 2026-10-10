import cooking from "@/imports/a4ebfa7d97a0cbad273f046153d61bb2-1.jpg"
import nyt from "@/imports/IMG_8735-1.jpg"
import f1 from "@/imports/e879fbe87a6553c74fafc66039d7eecbx-1.jpg"
import futbol from "@/imports/image00002-1.jpeg"
import fpl from "@/imports/fpl-1.png"
import window1 from "@/imports/image00001.jpeg"
import boardGames from "@/imports/IMG_5557.jpg"
import hotChoc from "@/imports/16.jpg"
import skincare from "@/imports/IMG_5623.jpg"
import fruit from "@/imports/IMG_7686-1.jpg"

export type AboutExtra = {
  intro: string
  bio: string
  languages: [string, string][]
  interests: string[]
  interestImages?: string[]
  faqs: [string, string][]
}

export const aboutContent: Record<"growth" | "brand", AboutExtra> = {
  growth: {
    intro: "hello! i'm rutuja, a full-stack growth marketer",
    bio: "i love working on strategy, positioning, customer journeys, and using data to curate thoughtful campaigns. here's a (slightly long) video summarizing my work (so far)",
    languages: [
      ["english", "fluent"],
      ["hindi", "native"],
      ["marathi", "native"],
    ],
    interests: [
      "cooking (for 1)",
      "nyt games <3",
      "listening to the dutch national anthem",
      "watching futbol",
      "crushing it in fpl",
    ],
    interestImages: [cooking, nyt, f1, futbol, fpl],
    faqs: [
      ["what kind of growth work do you do?", "early-stage product growth: activation, lifecycle, paid and creator experiments, plus the reporting that tells you what actually moved."],
      ["what stage of company do you work best with?", "seed to Series A, where one person can still touch positioning, channels and measurement."],
      ["how do you pick what to test first?", "i score ideas on impact, confidence and effort, then start with the cheapest test that could change the plan."],
      ["which tools do you rely on?", "PostHog, Google Analytics, Clay, Mailchimp and Shopify, plus whatever lets me ship faster."],
      ["are you open to full-time roles?", "yes, i'm looking for a product marketing / growth manager role and still take on selected freelance projects."],
      ["how can we work together?", "book a call or send an email from the contact card. i reply within a couple of days."],
    ],
  },
  brand: {
    intro: "hello again!",
    bio: "i love writing for socials, email, ads, blogs, changelogs, descriptions, and OOH. and ultimatums (if necessary). i'm also an active pop culture consumer (read: critic), an avid sports fan, and a daily puzzle solver who's very selectively chronically online.",
    languages: [
      ["english", "writes in it daily"],
      ["hindi", "native"],
      ["marathi", "native"],
    ],
    interests: [
      "staring out of the window",
      "losing at board games",
      "drinking ungodly amounts of hot chocolate (winter edition)",
      "skincare <3",
      "chopping fruit",
    ],
    interestImages: [window1, boardGames, hotChoc, skincare, fruit],
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
