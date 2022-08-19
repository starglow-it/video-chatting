import { ICommonTemplate } from "../interfaces/common-template.interface";

interface BaseTemplate
  extends Omit<
    ICommonTemplate,
    "businessCategories" | "previewUrls" | "stripeProductId"
  > {
  businessCategories: string[];
  imagesUrl?: string;
  videoPath?: string;
  imagePath?: string;
}

export const templatesData: BaseTemplate[] = [
  {
    templateId: 1,
    url: "https://vimeo.com/683820654/424a4cb337",
    videoPath: "/ibiza2",
    imagePath: "/free-ibiza2",
    name: "Ibiza Patio",
    maxParticipants: 2,
    description: "Gather round a crackling firepit by the beach",
    type: "free",
    isAudioAvailable: true,
    businessCategories: [
      "Counselling",
      "Sounds",
      "Mediation",
      "Consulting",
      "Therapeutic",
      "Private",
      "ASMR",
    ],
    usersPosition: [
      {
        bottom: 0.46,
        left: 0.27,
      },
      {
        bottom: 0.46,
        left: 0.58,
      },
    ],
  },
  {
    templateId: 2,
    url: "https://vimeo.com/683821458",
    videoPath: "/ibiza3",
    imagePath: "/free-ibiza3",
    name: "Ibiza Patio",
    maxParticipants: 3,
    description: "Gather round a crackling firepit by the beach",
    type: "free",
    isAudioAvailable: true,
    businessCategories: [
      "Counselling",
      "Sounds",
      "Mediation",
      "Consulting",
      "Therapeutic",
      "Private",
      "ASMR",
    ],
    usersPosition: [
      {
        bottom: 0.41,
        left: 0.19,
      },
      {
        bottom: 0.46,
        left: 0.44,
      },
      {
        bottom: 0.41,
        left: 0.69,
      },
    ],
  },
  {
    templateId: 3,
    url: "https://vimeo.com/683822180/ec56604e5b",
    videoPath: "/ibiza4",
    imagePath: "/free-ibiza4",
    name: "Ibiza Patio",
    maxParticipants: 4,
    description: "Gather round a crackling firepit by the beach",
    type: "free",
    isAudioAvailable: true,
    businessCategories: [
      "Counselling",
      "Sounds",
      "Mediation",
      "Consulting",
      "Therapeutic",
      "Private",
      "ASMR",
      "Team meeting",
    ],
    usersPosition: [
      {
        bottom: 0.41,
        left: 0.17,
      },
      {
        bottom: 0.46,
        left: 0.39,
      },
      {
        bottom: 0.46,
        left: 0.59,
      },
      {
        bottom: 0.41,
        left: 0.74,
      },
    ],
  },
  {
    templateId: 4,
    url: "https://vimeo.com/689593453",
    videoPath: "/lake_harmony",
    imagePath: "/free-lake_harmony",
    name: "Lakeside Office",
    maxParticipants: 4,
    description: "Get inspired in a calming yet energizing environment",
    type: "free",
    isAudioAvailable: true,
    businessCategories: [
      "Counselling",
      "Consulting",
      "Mediation",
      "Team Meeting",
      "Restorative",
      "Calming",
    ],
    usersPosition: [
      {
        bottom: 0.41,
        left: 0.16,
      },
      {
        bottom: 0.46,
        left: 0.39,
      },
      {
        bottom: 0.46,
        left: 0.59,
      },
      {
        bottom: 0.41,
        left: 0.84,
      },
    ],
  },
  {
    templateId: 5,
    url: "https://vimeo.com/692426911",
    videoPath: "/rustic",
    imagePath: "/free-rustic",
    name: "Countryside Office",
    maxParticipants: 3,
    description: "Enter a rustic office surrounded by Nature",
    type: "free",
    isAudioAvailable: true,
    businessCategories: [
      "Counselling",
      "Consulting",
      "Mediation",
      "Sounds",
      "Calming",
      "Restorative",
      "Nature",
      "ASMR",
    ],
    usersPosition: [
      {
        bottom: 0.47,
        left: 0.19,
      },
      {
        bottom: 0.46,
        left: 0.49,
      },
      {
        bottom: 0.49,
        left: 0.76,
      },
    ],
  },
  {
    templateId: 6,
    url: "https://vimeo.com/693199730",
    videoPath: "/retro",
    imagePath: "/free-retro",
    name: "1970's Office",
    maxParticipants: 3,
    description: "Enjoy the rich visuals of the Retro era",
    type: "free",
    isAudioAvailable: true,
    businessCategories: [
      "Counselling",
      "Consulting",
      "Sounds",
      "Private",
      "Funky",
      "Cozy",
    ],
    usersPosition: [
      {
        bottom: 0.5,
        left: 0.15,
      },
      {
        bottom: 0.5,
        left: 0.49,
      },
      {
        bottom: 0.5,
        left: 0.83,
      },
    ],
  },
  {
    templateId: 7,
    url: "https://vimeo.com/694742409",
    videoPath: "/tat",
    imagePath: "/free-tat",
    name: "Modern office",
    maxParticipants: 2,
    description: "Share a private conversation in a sunny office",
    type: "free",
    isAudioAvailable: false,
    businessCategories: [
      "Counselling",
      "Consulting",
      "Calming",
      "Energizing",
      "Private",
    ],
    usersPosition: [
      {
        bottom: 0.44,
        left: 0.15,
      },
      {
        bottom: 0.44,
        left: 0.8,
      },
    ],
  },
  {
    templateId: 8,
    url: "https://vimeo.com/695301547/7ff47a2be8",
    videoPath: "/cascadia",
    imagePath: "/cascadia",
    name: "Cascadia",
    maxParticipants: 6,
    description: "Meet and chat in an idyllic patio with a dramatic backdrop",
    type: "paid",
    priceInCents: 1000,
    isAudioAvailable: true,
    businessCategories: [
      "Counselling",
      "Consulting",
      "Team Meeting",
      "Secluded",
      "Energizing",
      "Restorative",
      "Nature",
      "ASMR",
    ],
    usersPosition: [
      {
        bottom: 0.21,
        left: 0.17,
      },
      {
        bottom: 0.25,
        left: 0.3,
      },
      {
        bottom: 0.25,
        left: 0.44,
      },
      {
        bottom: 0.25,
        left: 0.62,
      },
      {
        bottom: 0.23,
        left: 0.78,
      },
      {
        bottom: 0.22,
        left: 0.91,
      },
    ],
  },
  {
    templateId: 9,
    url: "https://vimeo.com/695301547/7ff47a2be8",
    videoPath: "/cascadia",
    imagePath: "/free-cascadia",
    name: "Cascadia",
    maxParticipants: 4,
    description: "Meet and chat in an idyllic patio with a dramatic backdrop",
    type: "free",
    isAudioAvailable: true,
    businessCategories: [
      "Counselling",
      "Consulting",
      "Team Meeting",
      "Secluded",
      "Energizing",
      "Restorative",
      "Nature",
      "ASMR",
    ],
    usersPosition: [
      {
        bottom: 0.21,
        left: 0.17,
      },
      {
        bottom: 0.25,
        left: 0.3,
      },
      {
        bottom: 0.25,
        left: 0.44,
      },
      {
        bottom: 0.25,
        left: 0.62,
      },
    ],
  },
  {
    templateId: 10,
    url: "https://vimeo.com/695546151",
    videoPath: "/therapist-hi",
    imagePath: "/free-therapist-hi",
    name: "Therapy Office (at the desk)",
    maxParticipants: 2,
    description: "This office is modern yet iconic featuring a calming vista",
    type: "free",
    isAudioAvailable: true,
    businessCategories: ["Counselling", "Calming", "Private", "ASMR"],
    usersPosition: [
      {
        bottom: 0.49,
        left: 0.56,
      },
      {
        bottom: 0.35,
        left: 0.22,
      },
    ],
  },
  {
    templateId: 11,
    url: "https://vimeo.com/695546183",
    videoPath: "/therapist-session",
    imagePath: "/free-therapist-session",
    name: "Therapy Office (on the couch)",
    maxParticipants: 2,
    description: "This office is modern yet iconic featuring a calming vista",
    type: "free",
    isAudioAvailable: true,
    businessCategories: ["Counselling", "Calming", "Private", "ASMR"],
    usersPosition: [
      {
        bottom: 0.45,
        left: 0.4,
      },
      {
        bottom: 0.3,
        left: 0.75,
      },
    ],
  },
  {
    templateId: 12,
    url: "https://vimeo.com/695855516",
    videoPath: "/executive1",
    imagePath: "/free-executive1",
    name: "New York Executive",
    maxParticipants: 3,
    description: "Lead meetings in an office with a prime view on Central Park",
    type: "free",
    isAudioAvailable: false,
    businessCategories: [
      "Legal",
      "Consulting",
      "Focused",
      "Energizing",
      "Calming",
    ],
    usersPosition: [
      {
        bottom: 0.63,
        left: 0.73,
      },
      {
        bottom: 0.56,
        left: 0.34,
      },
      {
        bottom: 0.35,
        left: 0.45,
      },
    ],
  },
  {
    templateId: 13,
    url: "https://vimeo.com/695955149",
    videoPath: "/executivebeach",
    imagePath: "/free-executivebeach",
    name: "Tropical Executive",
    maxParticipants: 3,
    description: "A neo-classic office featuring ocean views",
    type: "free",
    isAudioAvailable: true,
    businessCategories: [
      "Legal",
      "Consulting",
      "Mediation",
      "ASMR",
      "Private",
      "Calming",
    ],
    usersPosition: [
      {
        bottom: 0.51,
        left: 0.55,
      },
      {
        bottom: 0.33,
        left: 0.32,
      },
      {
        bottom: 0.33,
        left: 0.82,
      },
    ],
  },
  {
    templateId: 14,
    url: "https://vimeo.com/696216268",
    videoPath: "/office",
    imagePath: "/free-office",
    name: "Regency Office",
    maxParticipants: 2,
    description: "This office offers a warm and balanced ambiance",
    type: "free",
    isAudioAvailable: false,
    businessCategories: ["Legal", "Consulting", "Private", "Calming"],
    usersPosition: [
      {
        bottom: 0.51,
        left: 0.14,
      },
      {
        bottom: 0.46,
        left: 0.79,
      },
    ],
  },
  {
    templateId: 15,
    url: "https://vimeo.com/696332207",
    videoPath: "/graffiti",
    imagePath: "/free-graffiti",
    name: "Apocalypto",
    maxParticipants: 4,
    description: "The ultimate huddle",
    type: "free",
    isAudioAvailable: true,
    businessCategories: ["Team meeting", "Calming", "Private", "ASMR"],
    usersPosition: [
      {
        bottom: 0.78,
        left: 0.21,
      },
      {
        bottom: 0.58,
        left: 0.06,
      },
      {
        bottom: 0.58,
        left: 0.22,
      },
      {
        bottom: 0.58,
        left: 0.43,
      },
    ],
  },
  {
    templateId: 16,
    url: "https://vimeo.com/696332207",
    videoPath: "/graffiti",
    imagePath: "/graffiti",
    name: "Apocalypto",
    maxParticipants: 6,
    description: "The ultimate huddle",
    type: "paid",
    priceInCents: 1000,
    isAudioAvailable: true,
    businessCategories: ["Team meeting", "Calming", "Private", "ASMR"],
    usersPosition: [
      {
        bottom: 0.78,
        left: 0.21,
      },
      {
        bottom: 0.58,
        left: 0.06,
      },
      {
        bottom: 0.58,
        left: 0.22,
      },
      {
        bottom: 0.58,
        left: 0.43,
      },
      {
        bottom: 0.58,
        left: 0.59,
      },
      {
        bottom: 0.46,
        left: 0.92,
      },
    ],
  },
  {
    templateId: 17,
    url: "https://vimeo.com/696774277",
    videoPath: "/fireandfog",
    imagePath: "/free-fireandfog",
    name: "Foggy Vista",
    maxParticipants: 2,
    description: "A soothing and calming ambiance",
    type: "free",
    isAudioAvailable: true,
    businessCategories: ["Therapy", "Calming", "Private", "Soothing", "ASMR"],
    usersPosition: [
      {
        bottom: 0.22,
        left: 0.33,
      },
      {
        bottom: 0.22,
        left: 0.67,
      },
    ],
  },
  {
    templateId: 18,
    url: "https://vimeo.com/696834848",
    videoPath: "/ocean_vista",
    imagePath: "/free-ocean_vista",
    name: "Ocean View",
    maxParticipants: 2,
    description: "Take a seat in a restorative and calming set",
    type: "free",
    isAudioAvailable: true,
    businessCategories: ["Therapy", "Calming", "Private", "Soothing", "ASMR"],
    usersPosition: [
      {
        bottom: 0.31,
        left: 0.31,
      },
      {
        bottom: 0.31,
        left: 0.65,
      },
    ],
  },
  {
    templateId: 19,
    url: "https://vimeo.com/696838654",
    videoPath: "/centralpark",
    imagePath: "/free-centralpark",
    name: "Central Park View",
    maxParticipants: 2,
    description: "Enjoy a conversation overlooking New York's Central Park",
    type: "free",
    isAudioAvailable: true,
    businessCategories: ["Therapy", "Calming", "Private", "Soothing", "ASMR"],
    usersPosition: [
      {
        bottom: 0.22,
        left: 0.33,
      },
      {
        bottom: 0.22,
        left: 0.67,
      },
    ],
  },
  {
    templateId: 20,
    url: "https://vimeo.com/706268372",
    videoPath: "/ralph_lauren",
    imagePath: "/free-ralph_lauren",
    name: "Virtual Luxury",
    maxParticipants: 4,
    description: "Ralph Lauren's signature Shelter Point",
    type: "free",
    isAudioAvailable: true,
    businessCategories: [
      "Store",
      "Team meeting",
      "Calming",
      "Soothing",
      "ASMR",
    ],
    usersPosition: [
      {
        bottom: 0.36,
        left: 0.05,
      },
      {
        bottom: 0.31,
        left: 0.34,
      },
      {
        bottom: 0.31,
        left: 0.82,
      },
      {
        bottom: 0.43,
        left: 0.91,
      },
    ],
    links: [
      {
        item: "https://www.ralphlaurenhome.com/products/Furniture/item.aspx?haid=7&collId=&shaid=&sort=&itemId=38525&phaid=",
        position: { top: 0.8, left: 0.9 },
      },
      {
        item: "https://www.ralphlauren.com/home-shelter-point-lifestyle-cg/umber-walnut-drinks-table/100001390.html?dwvar_100001390_home-furniture-finish=Oiled%20Walnut&cgid=home-shelter-point-lifestyle-cg&webcat=search#ab=en_US_HomeLP_Slot_1_S1_L1_SHOP&start=1&cgid=home-shelter-point-lifestyle-cg",
        position: { top: 0.9, left: 0.73 },
      },
      {
        item: "https://www.ralphlaurenhome.com/products/Furniture/item.aspx?haid=6&collId=&shaid=&sort=&itemId=38136&phaid=",
        position: { top: 0.9, left: 0.32 },
      },
      {
        item: "https://www.ralphlauren.com/home-furniture-tables/shelter-point-oak-cocktail-table/100001385.html?ab=en_us_PLP_shelter_point_lifestyle_Slot_5_S1_L1_SHOP",
        position: { top: 0.75, left: 0.6 },
      },
      {
        item: "https://www.ralphlauren.com/home-shelter-point-lifestyle-cg/modern-mini-hurricane/520026.html?dwvar520026_colorname=Silver&cgid=home-shelter-point-lifestyle-cg&webcat=search#ab=en_US_HomeLP_Slot_1_S1_L1_SHOP&start=1&cgid=home-shelter-point-lifestyle-cg",
        position: { top: 0.6, left: 0.62 },
      },
      {
        item: "https://www.ralphlauren.com/home-lighting-table-lamps/rl-67-boom-arm-floor-lamp/0042559294.html?pdpR=y",
        position: { top: 0.35, left: 0.68 },
      },
    ],
  },
  {
    templateId: 21,
    url: "https://vimeo.com/709641634",
    videoPath: "/paris_final",
    imagePath: "/free-paris_final",
    name: "Paris café",
    maxParticipants: 4,
    description: "Sit and relax at a typical Parisian café",
    type: "free",
    isAudioAvailable: true,
    businessCategories: [
      "Counselling",
      "Consulting",
      "Legal",
      "Team meeting",
      "Sounds",
      "Calming",
      "Restorative",
      "Energizing",
    ],
    usersPosition: [
      {
        bottom: 0.2,
        left: 0.15,
      },
      {
        bottom: 0.24,
        left: 0.48,
      },
      {
        bottom: 0.29,
        left: 0.72,
      },
      {
        bottom: 0.33,
        left: 0.93,
      },
    ],
  },
  {
    templateId: 22,
    url: "https://vimeo.com/714306605",
    videoPath: "/together_clouds",
    imagePath: "/together_clouds",
    name: "Cloud 9",
    maxParticipants: 6,
    description: "Enjoy our Together mode while floating in the clouds",
    type: "paid",
    priceInCents: 1000,
    isAudioAvailable: true,
    businessCategories: ["Team meeting", "Calming", "Private", "ASMR"],
    usersPosition: [
      {
        bottom: 0.75,
        left: 0.575,
      },
      {
        bottom: 0.5,
        left: 0.65,
      },
      {
        bottom: 0.25,
        left: 0.575,
      },
      {
        bottom: 0.25,
        left: 0.425,
      },
      {
        bottom: 0.5,
        left: 0.35,
      },
      {
        bottom: 0.75,
        left: 0.425,
      },
    ],
  },
  {
    templateId: 23,
    url: "https://vimeo.com/714306605",
    videoPath: "/together_clouds",
    imagePath: "/free-together_clouds",
    name: "Cloud 9",
    maxParticipants: 4,
    description: "Enjoy our Together mode while floating in the clouds",
    type: "free",
    isAudioAvailable: true,
    businessCategories: ["Team meeting", "Calming", "Private", "ASMR"],
    usersPosition: [
      {
        bottom: 0.6,
        left: 0.6,
      },
      {
        bottom: 0.3,
        left: 0.6,
      },
      {
        bottom: 0.3,
        left: 0.3,
      },
      {
        bottom: 0.6,
        left: 0.3,
      },
    ],
  },
  {
    templateId: 24,
    url: "https://vimeo.com/714306354",
    videoPath: "/loop_campfire",
    imagePath: "/free-loop_campfire",
    name: "The Firepit",
    maxParticipants: 4,
    description: "Enjoy our Together mode around a firepit",
    type: "free",
    isAudioAvailable: true,
    businessCategories: [
      "Therapy",
      "Counselling",
      "Team meeting",
      "Focused",
      "Restorative",
      "Private",
      "ASMR",
    ],
    usersPosition: [
      {
        bottom: 0.6,
        left: 0.6,
      },
      {
        bottom: 0.3,
        left: 0.6,
      },
      {
        bottom: 0.3,
        left: 0.3,
      },
      {
        bottom: 0.6,
        left: 0.3,
      },
    ],
  },
  {
    templateId: 25,
    url: "https://vimeo.com/714306354",
    videoPath: "/loop_campfire",
    imagePath: "/loop_campfire",
    name: "The Firepit",
    maxParticipants: 6,
    description: "Enjoy our Together mode around a firepit",
    type: "paid",
    priceInCents: 1000,
    isAudioAvailable: true,
    businessCategories: [
      "Therapy",
      "Counselling",
      "Team meeting",
      "Focused",
      "Restorative",
      "Private",
      "ASMR",
    ],
    usersPosition: [
      {
        bottom: 0.75,
        left: 0.575,
      },
      {
        bottom: 0.5,
        left: 0.65,
      },
      {
        bottom: 0.25,
        left: 0.575,
      },
      {
        bottom: 0.25,
        left: 0.425,
      },
      {
        bottom: 0.5,
        left: 0.35,
      },
      {
        bottom: 0.75,
        left: 0.425,
      },
    ],
  },
  {
    templateId: 26,
    url: "https://vimeo.com/714306497",
    videoPath: "/together_beach",
    imagePath: "/together_beach",
    name: "Vista Rica",
    maxParticipants: 6,
    description: "Enjoy our Together mode overlooking a beautiful ocean vista",
    type: "paid",
    priceInCents: 1000,
    isAudioAvailable: true,
    businessCategories: [
      "Team meeting",
      "Consulting",
      "Coaching",
      "Focused",
      "Restorative",
      "Calming",
      "ASMR",
    ],
    usersPosition: [
      {
        bottom: 0.75,
        left: 0.575,
      },
      {
        bottom: 0.5,
        left: 0.65,
      },
      {
        bottom: 0.25,
        left: 0.575,
      },
      {
        bottom: 0.25,
        left: 0.425,
      },
      {
        bottom: 0.5,
        left: 0.35,
      },
      {
        bottom: 0.75,
        left: 0.425,
      },
    ],
  },
  {
    templateId: 27,
    url: "https://vimeo.com/719688289",
    videoPath: "/zen-loop-audio",
    imagePath: "/free-zen-loop-audio",
    name: "Zen Room",
    maxParticipants: 4,
    description: "Relax in a calm Zen room",
    type: "free",
    isAudioAvailable: true,
    businessCategories: [
      "Counselling",
      "Meditation",
      "Team meeting",
      "Calming",
      "Soothing",
      "ASMR",
    ],
    usersPosition: [
      {
        bottom: 0.28,
        left: 0.2,
      },
      {
        bottom: 0.24,
        left: 0.385,
      },
      {
        bottom: 0.24,
        left: 0.595,
      },
      {
        bottom: 0.28,
        left: 0.795,
      },
    ],
  },
  {
    templateId: 28,
    url: "https://vimeo.com/719688394",
    videoPath: "/zen2-loop",
    imagePath: "/free-zen2-loop",
    name: "Zen Pond",
    maxParticipants: 4,
    description: "Zen out at the edge of a still pond",
    type: "free",
    isAudioAvailable: true,
    businessCategories: [
      "Counselling",
      "Meditation",
      "Team meeting",
      "Calming",
      "Soothing",
      "ASMR",
    ],
    usersPosition: [
      {
        bottom: 0.28,
        left: 0.2,
      },
      {
        bottom: 0.24,
        left: 0.385,
      },
      {
        bottom: 0.24,
        left: 0.595,
      },
      {
        bottom: 0.28,
        left: 0.795,
      },
    ],
  },
  {
    templateId: 29,
    url: "https://vimeo.com/719922659",
    videoPath: "/heart",
    imagePath: "/heart4",
    name: "Breathing Heart Exercise",
    maxParticipants: 4,
    description: "Box Breathing method for anxiety and calm",
    type: "free",
    isAudioAvailable: true,
    businessCategories: [
      "Meditation",
      "Team meeting",
      "Calming",
      "Focused Soothing",
    ],
    usersPosition: [
      {
        bottom: 0.6,
        left: 0.6,
      },
      {
        bottom: 0.3,
        left: 0.6,
      },
      {
        bottom: 0.3,
        left: 0.3,
      },
      {
        bottom: 0.6,
        left: 0.3,
      },
    ],
  },
  {
    templateId: 30,
    url: "https://vimeo.com/719922659",
    videoPath: "/heart",
    imagePath: "/heart6",
    name: "Breathing Heart Exercise",
    maxParticipants: 6,
    description: "Box Breathing method for anxiety and calm",
    type: "free",
    isAudioAvailable: true,
    businessCategories: [
      "Meditation",
      "Team meeting",
      "Calming",
      "Focused Soothing",
    ],
    usersPosition: [
      {
        bottom: 0.75,
        left: 0.575,
      },
      {
        bottom: 0.5,
        left: 0.65,
      },
      {
        bottom: 0.25,
        left: 0.575,
      },
      {
        bottom: 0.25,
        left: 0.425,
      },
      {
        bottom: 0.5,
        left: 0.35,
      },
      {
        bottom: 0.75,
        left: 0.425,
      },
    ],
  },
  {
    templateId: 31,
    url: "https://vimeo.com/719937967",
    videoPath: "/abstract",
    imagePath: "/free-abstract",
    name: "Abstract Solar",
    maxParticipants: 4,
    description: "A soothing background for meetings",
    type: "free",
    isAudioAvailable: false,
    businessCategories: [
      "Team meeting",
      "Consulting",
      "Coaching",
      "Focused",
      "Restorative",
      "Calming",
    ],
    usersPosition: [
      {
        bottom: 0.6,
        left: 0.6,
      },
      {
        bottom: 0.3,
        left: 0.6,
      },
      {
        bottom: 0.3,
        left: 0.3,
      },
      {
        bottom: 0.6,
        left: 0.3,
      },
    ],
  },
  {
    templateId: 32,
    url: "https://vimeo.com/719937967",
    videoPath: "/abstract",
    imagePath: "/abstract",
    name: "Abstract Solar",
    maxParticipants: 6,
    description: "A soothing background for meetings",
    type: "paid",
    priceInCents: 1000,
    isAudioAvailable: false,
    businessCategories: [
      "Team meeting",
      "Consulting",
      "Coaching",
      "Focused",
      "Restorative",
      "Calming",
    ],
    usersPosition: [
      {
        bottom: 0.75,
        left: 0.575,
      },
      {
        bottom: 0.5,
        left: 0.65,
      },
      {
        bottom: 0.25,
        left: 0.575,
      },
      {
        bottom: 0.25,
        left: 0.425,
      },
      {
        bottom: 0.5,
        left: 0.35,
      },
      {
        bottom: 0.75,
        left: 0.425,
      },
    ],
  },
  {
    templateId: 33,
    url: "",
    imagesUrl: "/calm6",
    imagePath: "/free-calm6",
    name: "Simply Nice",
    maxParticipants: 4,
    description: "A static, professional & calming ambient",
    type: "free",
    isAudioAvailable: false,
    businessCategories: [
      "Team meeting",
      "Consulting",
      "Coaching",
      "Focused",
      "Restorative",
      "Calming",
    ],
    usersPosition: [
      {
        bottom: 0.6,
        left: 0.6,
      },
      {
        bottom: 0.3,
        left: 0.6,
      },
      {
        bottom: 0.3,
        left: 0.3,
      },
      {
        bottom: 0.6,
        left: 0.3,
      },
    ],
  },
  {
    templateId: 34,
    url: "",
    imagesUrl: "/calm6",
    imagePath: "/calm6",
    name: "Simply Nice",
    maxParticipants: 6,
    description: "A static, professional & calming ambient",
    type: "paid",
    priceInCents: 1000,
    isAudioAvailable: false,
    businessCategories: [
      "Team meeting",
      "Consulting",
      "Coaching",
      "Focused",
      "Restorative",
      "Calming",
    ],
    usersPosition: [
      {
        bottom: 0.75,
        left: 0.575,
      },
      {
        bottom: 0.5,
        left: 0.65,
      },
      {
        bottom: 0.25,
        left: 0.575,
      },
      {
        bottom: 0.25,
        left: 0.425,
      },
      {
        bottom: 0.5,
        left: 0.35,
      },
      {
        bottom: 0.75,
        left: 0.425,
      },
    ],
  },
  {
    templateId: 35,
    url: "https://vimeo.com/728142563",
    videoPath: "/germany",
    imagePath: "/germany",
    name: "German Team",
    maxParticipants: 5,
    description: "Fabulous germany team",
    type: "free",
    isAudioAvailable: false,
    businessCategories: ["Team meeting"],
    usersPosition: [
      {
        bottom: 0.81,
        left: 0.805,
      },
      {
        bottom: 0.72,
        left: 0.655,
      },
      {
        bottom: 0.67,
        left: 0.495,
      },
      {
        bottom: 0.71,
        left: 0.345,
      },
      {
        bottom: 0.73,
        left: 0.185,
      },
    ],
  },
];
