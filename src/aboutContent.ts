import cooking from "@/imports/cooking.jpg"
import nyt from "@/imports/nyt-games.jpg"
import f1 from "@/imports/formula-one.jpg"
import futbol from "@/imports/football.jpeg"
import fpl from "@/imports/fantasy-premier-league.png"
import window1 from "@/imports/window-view.jpeg"
import boardGames from "@/imports/board-games.jpg"
import hotChoc from "@/imports/hot-chocolate.jpg"
import skincare from "@/imports/skincare.jpg"
import fruit from "@/imports/fruit.jpg"

export type AboutExtra = {
  intro: string
  bio: string
  languages: [string, string][]
  interests: string[]
  interestImages: string[]
  faqs: [string, string][]
}

export const aboutContent: Record<"growth" | "brand", AboutExtra> = {
  growth: {
    intro: "hello! i'm rutuja, a full-stack growth marketer",
    bio: "i love working on strategy, positioning, customer journeys, and using data to curate thoughtful campaigns. \n\n here's a (slightly long) video summarizing my work (so far)",
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
      ["what kind of growth work do you do?", "early-stage product growth: social, email drips, paid and creator experiments"],
      ["what stage of company do you work best with?", "seed to Series A, but open to the right opportunity/fit at later stages"],
      ["are you good with strategy?", "i ranked 1721 globally in a gameweek in fpl 24/25. is that proof enough?"],
      ["how do you work best?", "with some guidance and a lot of autonomy [to do more.]"],
      ["are you open to full-time roles?", "yes, i'm open to product/growth/brand marketing roles"],
      ["how soon can you start?", "14 days after 'it's a match!'"],
    ],
  },
  brand: {
    intro: "hello again! this is your brand marketer speaking",
    bio: "i love writing (and brainstorming ideas) for social, email, ads, blogs, changelogs, descriptions, and OOH. also, ultimatums, if necessary. \n\n i'm also an active pop culture consumer (read: critic), an avid sports fan, and a daily puzzle solver who's very selectively chronically online.",
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
      ["what got you into marketing?", "my love for a good coffee <3 oh no, i mean copy"],
      ["what's your biggest achievement?", "does getting the wordle correct on the first try (twice!) count?"],
      ["how ready are you for your next full-time role?", "thanks to my redemption era, i'm ready to get back like yesterday"],
      ["is there anything you cannot do?", "yes, a backflip (yet!)"],
      ["which writers or brands inspire you?", "anything that sounds like a person wrote it. i keep a running list on the moodboard."],
      ["why should we hire you?", "because you have power vested in you to get super earnest (& fun?) people on board and you should totally use it :)"],
    ],
  },
}
