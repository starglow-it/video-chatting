import {ICommonTemplate} from "../interfaces/common-template.interface";

interface BaseTemplate extends Omit<ICommonTemplate, 'businessCategories'> {
    businessCategories: string[];
}

export const templatesData: BaseTemplate[] = [
    {
        templateId: 1,
        url: 'https://vimeo.com/683820654/424a4cb337',
        previewUrl: '/templates/images/ibiza2/ibiza2_540p.jpg',
        name: 'Ibiza Patio',
        maxParticipants: 2,
        description: 'Gather round a crackling firepit by the beach',
        type: 'free',
        businessCategories: [
            'Counselling',
            'Sounds',
            'Mediation',
            'Consulting',
            'Therapeutic',
            'Private',
            'ASMR'
        ],
        usersPosition: [
            {
                top: 0.54,
                left: 0.27
            },
            {
                top: 0.54,
                left: 0.58
            },
        ]
    },
    {
        templateId: 2,
        url: 'https://vimeo.com/683821458',
        previewUrl: '/templates/images/ibiza3/ibiza3_540p.jpg',
        name: 'Ibiza Patio',
        maxParticipants: 3,
        description: 'Gather round a crackling firepit by the beach',
        type: 'free',
        businessCategories: [
            'Counselling',
            'Sounds',
            'Mediation',
            'Consulting',
            'Therapeutic',
            'Private',
            'ASMR'
        ],
        usersPosition: [
            {
                top: 0.59,
                left: 0.19
            },
            {
                top: 0.54,
                left: 0.44
            },
            {
                top: 0.59,
                left: 0.69
            }
        ]
    },
    {
        templateId: 3,
        url: 'https://vimeo.com/683822180/ec56604e5b',
        previewUrl: '/templates/images/ibiza4/ibiza4_540p.jpg',
        name: 'Ibiza Patio',
        maxParticipants: 4,
        description: 'Gather round a crackling firepit by the beach',
        type: 'free',
        businessCategories: [
            'Counselling',
            'Sounds',
            'Mediation',
            'Consulting',
            'Therapeutic',
            'Private',
            'ASMR',
            'Team meeting'
        ],
        usersPosition: [
            {
                top: 0.59,
                left: 0.17
            },
            {
                top: 0.54,
                left: 0.39
            },
            {
                top: 0.54,
                left: 0.59
            },
            {
                top: 0.59,
                left: 0.74
            }
        ]
    },
    {
        templateId: 4,
        url: 'https://vimeo.com/689593453',
        previewUrl: '/templates/images/lakeside3/lakeside3_360p.jpg',
        name: 'Lakeside Office',
        maxParticipants: 4,
        description: 'Get inspired in a calming yet energizing environment',
        type: 'free',
        businessCategories: [
            'Counselling',
            'Consulting',
            'Mediation',
            'Team Meeting',
            'Restorative',
            'Calming',
        ],
        usersPosition: [
            {
                top: 0.59,
                left: 0.16
            },
            {
                top: 0.54,
                left: 0.39
            },
            {
                top: 0.54,
                left: 0.59
            },
            {
                top: 0.59,
                left: 0.84
            },
        ]
    },
    {
        templateId: 5,
        url: 'https://vimeo.com/692426911',
        previewUrl: '/templates/images/rustic/rustic3_540p.jpg',
        name: 'Countryside Office',
        maxParticipants: 3,
        description: 'Enter a rustic office surrounded by Nature',
        type: 'free',
        businessCategories: [
            'Counselling',
            'Consulting',
            'Mediation',
            'Sounds',
            'Calming',
            'Restorative',
            'Nature',
            'ASMR'
        ],
        usersPosition: [
            {
                top: 0.53,
                left: 0.19
            },
            {
                top: 0.54,
                left: 0.49
            },
            {
                top: 0.51,
                left: 0.76
            }
        ]
    },
    {
        templateId: 6,
        url: 'https://vimeo.com/693199730',
        previewUrl: '/templates/images/retro/retro3_540p.jpg',
        name: "1970's Office",
        maxParticipants: 3,
        description: 'Enjoy the rich visuals of the Retro era',
        type: 'free',
        businessCategories: [
            'Counselling',
            'Consulting',
            'Sounds',
            'Private',
            'Funky',
            'Cozy'
        ],
        usersPosition: [
            {
                top: 0.49,
                left: 0.15
            },
            {
                top: 0.49,
                left: 0.49
            },
            {
                top: 0.49,
                left: 0.83
            }
        ]
    },
    {
        templateId: 7,
        url: 'https://vimeo.com/694742409',
        previewUrl: '/templates/images/tat/tat2_540p.jpg',
        name: "Modern office",
        maxParticipants: 2,
        description: 'Share a private conversation in a sunny office',
        type: 'free',
        businessCategories: [
            'Counselling',
            'Consulting',
            'Calming',
            'Energizing',
            'Private',
        ],
        usersPosition: [
            {
                top: 0.56,
                left: 0.15
            },
            {
                top: 0.56,
                left: 0.84
            }
        ]
    },
    {
        templateId: 8,
        url: 'https://vimeo.com/695301547/7ff47a2be8',
        previewUrl: '/templates/images/cascadia/cascadia6_540p.jpg',
        name: "Cascadia",
        maxParticipants: 6,
        description: 'Meet and chat in an idyllic patio with a dramatic backdrop',
        type: 'free',
        businessCategories: [
            'Counselling',
            'Consulting',
            'Team Meeting',
            'Secluded',
            'Energizing',
            'Restorative',
            'Nature',
            'ASMR',
        ],
        usersPosition: [
            {
                top: 0.79,
                left: 0.17
            },
            {
                top: 0.75,
                left: 0.3
            },
            {
                top: 0.75,
                left: 0.44
            },
            {
                top: 0.75,
                left: 0.62
            },
            {
                top: 0.77,
                left: 0.78
            },
            {
                top: 0.78,
                left: 0.91
            }
        ]
    },
    {
        templateId: 9,
        url: 'https://vimeo.com/695546151',
        previewUrl: '/templates/images/therapy_desk/therapist_desk2_540p.jpg',
        name: "Therapy Office (at the desk)",
        maxParticipants: 2,
        description: 'This office is modern yet iconic featuring a calming vista',
        type: 'free',
        businessCategories: [
            'Counselling',
            'Calming',
            'Private',
            'ASMR'
        ],
        usersPosition: [
            {
                top: 0.57,
                left: 0.37
            },
            {
                top: 0.66,
                left: 0.17
            }
        ]
    },
    {
        templateId: 10,
        url: 'https://vimeo.com/695546183',
        previewUrl: '/templates/images/therapy_session/therapist_session2_540p.jpg',
        name: "Therapy Office (on the couch)",
        maxParticipants: 2,
        description: 'This office is modern yet iconic featuring a calming vista',
        type: 'free',
        businessCategories: [
            'Counselling',
            'Calming',
            'Private',
            'ASMR'
        ],
        usersPosition: [
            {
                top: 0.63,
                left: 0.6
            },
            {
                top: 0.67,
                left: 0.83
            }
        ]
    },
    {
        templateId: 11,
        url: 'https://vimeo.com/695855516',
        previewUrl: '/templates/images/executive/executive3_540p.jpg',
        name: "New York Executive",
        maxParticipants: 3,
        description: 'Lead meetings in an office with a prime view on Central Park',
        type: 'free',
        businessCategories: [
            'Legal',
            'Consulting',
            'Focused',
            'Energizing',
            'Calming'
        ],
        usersPosition: [
            {
                top: 0.47,
                left: 0.67
            },
            {
                top: 0.57,
                left: 0.3
            },
            {
                top: 0.79,
                left: 0.42
            }
        ]
    },
    {
        templateId: 12,
        url: 'https://vimeo.com/695955149',
        previewUrl: '/templates/images/executivebeach/executivebeach3_540p.jpg',
        name: "Tropical Executive",
        maxParticipants: 3,
        description: 'A neo-classic office featuring ocean views',
        type: 'free',
        businessCategories: [
            'Legal',
            'Consulting',
            'Mediation',
            'ASMR',
            'Private',
            'Calming',
        ],
        usersPosition: [
            {
                top: 0.49,
                left: 0.55
            },
            {
                top: 0.67,
                left: 0.32
            },
            {
                top: 0.67,
                left: 0.82
            }
        ]
    },
    {
        templateId: 13,
        url: 'https://vimeo.com/696216268',
        previewUrl: '/templates/images/office/office3_540p.jpg',
        name: "Regency Office",
        maxParticipants: 2,
        description: 'This office offers a warm and balanced ambiance',
        type: 'free',
        businessCategories: [
            'Legal',
            'Consulting',
            'Private',
            'Calming',
        ],
        usersPosition: [
            {
                top: 0.49,
                left: 0.14
            },
            {
                top: 0.54,
                left: 0.79
            }
        ]
    },
    {
        templateId: 14,
        url: 'https://vimeo.com/696332207',
        previewUrl: '/templates/images/graffiti/graffiti6_540p.jpg',
        name: "Apocalypto",
        maxParticipants: 6,
        description: 'The ultimate huddle',
        type: 'free',
        businessCategories: [
            'Team meeting',
            'Calming',
            'Private',
            'ASMR'
        ],
        usersPosition: [
            {
                top: 0.81,
                left: 0.1
            },
            {
                top: 0.74,
                left: 0.3
            },
            {
                top: 0.94,
                left: 0.39
            },
            {
                top: 0.89,
                left: 0.64
            },
            {
                top: 0.79,
                left: 0.82
            },
            {
                top: 0.66,
                left: 0.49
            }
        ]
    },
    {
        templateId: 15,
        url: 'https://vimeo.com/696774277',
        previewUrl: '/templates/images/fireandfog/fireandfog_540p.jpg',
        name: "Foggy Vista",
        maxParticipants: 2,
        description: 'A soothing and calming ambiance',
        type: 'free',
        businessCategories: [
            'Therapy',
            'Calming',
            'Private',
            'Soothing',
            'ASMR'
        ],
        usersPosition: [
            {
                top: 0.69,
                left: 0.39
            },
            {
                top: 0.69,
                left: 0.61
            }
        ]
    },
    {
        templateId: 16,
        url: 'https://vimeo.com/696834848',
        previewUrl: '/templates/images/ocean_vista/ocean_vista2_540p.jpg',
        name: "Ocean View",
        maxParticipants: 2,
        description: 'Take a seat in a restorative and calming set',
        type: 'free',
        businessCategories: [
            'Therapy',
            'Calming',
            'Private',
            'Soothing',
            'ASMR'
        ],
        usersPosition: [
            {
                top: 0.69,
                left: 0.39
            },
            {
                top: 0.69,
                left: 0.61
            }
        ]
    },
    {
        templateId: 17,
        url: 'https://vimeo.com/696838654',
        previewUrl: '/templates/images/centralpark/centralpark2_540p.jpg',
        name: "Central Park View",
        maxParticipants: 2,
        description: "Enjoy a conversation overlooking New York's Central Park",
        type: 'free',
        businessCategories: [
            'Therapy',
            'Calming',
            'Private',
            'Soothing',
            'ASMR'
        ],
        usersPosition: [
            {
                top: 0.69,
                left: 0.39
            },
            {
                top: 0.69,
                left: 0.61
            }
        ]
    },
    {
        templateId: 18,
        url: 'https://vimeo.com/706268372',
        previewUrl: '/templates/images/ralph_lauren4/ralph_lauren4_540p.jpg',
        name: "Virtual Luxury",
        maxParticipants: 4,
        description: "Ralph Lauren's signature Shelter Point",
        type: 'free',
        businessCategories: [
            'Store',
            'Team meeting',
            'Calming',
            'Soothing',
            'ASMR'
        ],
        usersPosition: [
            {
                top: 0.64,
                left: 0.05
            },
            {
                top: 0.69,
                left: 0.34
            },
            {
                top: 0.69,
                left: 0.82
            },
            {
                top: 0.57,
                left: 0.91
            }
        ],
        links: [
            {
                item: "https://www.ralphlaurenhome.com/products/Furniture/item.aspx?haid=7&collId=&shaid=&sort=&itemId=38525&phaid=",
                position: { top: 0.80, left: 0.9 }
            },
            {
                item: "https://www.ralphlauren.com/home-shelter-point-lifestyle-cg/umber-walnut-drinks-table/100001390.html?dwvar_100001390_home-furniture-finish=Oiled%20Walnut&cgid=home-shelter-point-lifestyle-cg&webcat=search#ab=en_US_HomeLP_Slot_1_S1_L1_SHOP&start=1&cgid=home-shelter-point-lifestyle-cg",
                position: { top: 0.9, left: 0.73 }
            },
            {
                item: "https://www.ralphlaurenhome.com/products/Furniture/item.aspx?haid=6&collId=&shaid=&sort=&itemId=38136&phaid=",
                position: { top: 0.9, left: 0.32 }
            },
            {
                item: "https://www.ralphlauren.com/home-furniture-tables/shelter-point-oak-cocktail-table/100001385.html?ab=en_us_PLP_shelter_point_lifestyle_Slot_5_S1_L1_SHOP",
                position: { top: 0.75, left: 0.6 }
            },
            {
                item: "https://www.ralphlauren.com/home-shelter-point-lifestyle-cg/modern-mini-hurricane/520026.html?dwvar520026_colorname=Silver&cgid=home-shelter-point-lifestyle-cg&webcat=search#ab=en_US_HomeLP_Slot_1_S1_L1_SHOP&start=1&cgid=home-shelter-point-lifestyle-cg",
                position: { top: 0.6, left: 0.62 }
            },
            {
                item: "https://www.ralphlauren.com/home-lighting-table-lamps/rl-67-boom-arm-floor-lamp/0042559294.html?pdpR=y",
                position: { top: 0.35, left: 0.68 }
            }
        ]
    },
    {
        templateId: 19,
        url: 'https://vimeo.com/709641634',
        previewUrl: '/templates/images/paris4/paris4_540p.jpg',
        name: "Paris café",
        maxParticipants: 4,
        description: "Sit and relax at a typical Parisian café",
        type: 'free',
        businessCategories: [
            'Counselling',
            'Consulting',
            'Legal',
            'Team meeting',
            'Sounds',
            'Calming',
            'Restorative',
            'Energizing'
        ],
        usersPosition: [
            {
                top: 0.80,
                left: 0.15
            },
            {
                top: 0.76,
                left: 0.48
            },
            {
                top: 0.71,
                left: 0.72
            },
            {
                top: 0.67,
                left: 0.93
            }
        ]
    },
    {
        templateId: 20,
        url: 'https://vimeo.com/714306605',
        previewUrl: '/templates/images/clouds6/clouds6_540p.jpg',
        name: "Cloud 9",
        maxParticipants: 6,
        description: "Enjoy our Together mode while floating in the clouds",
        type: 'free',
        businessCategories: [
            'Team meeting',
            'Calming',
            'Private',
            'ASMR'
        ],
        usersPosition: [
            {
                top: 0.25,
                left: 0.575
            },
            {
                top: 0.50,
                left: 0.65
            },
            {
                top: 0.75,
                left: 0.575
            },
            {
                top: 0.75,
                left: 0.425
            },
            {
                top: 0.50,
                left: 0.35
            },
            {
                top: 0.25,
                left: 0.425
            }
        ]
    },
    {
        templateId: 21,
        url: 'https://vimeo.com/714306354',
        previewUrl: '/templates/images/firepit6/firepit6_540p.jpg',
        name: "The Firepit",
        maxParticipants: 6,
        description: "Enjoy our Together mode around a firepit",
        type: 'free',
        businessCategories: [
            'Therapy',
            'Counselling',
            'Team meeting',
            'Focused',
            'Restorative',
            'Private',
            'ASMR'
        ],
        usersPosition: [
            {
                top: 0.25,
                left: 0.575
            },
            {
                top: 0.50,
                left: 0.65
            },
            {
                top: 0.75,
                left: 0.575
            },
            {
                top: 0.75,
                left: 0.425
            },
            {
                top: 0.50,
                left: 0.35
            },
            {
                top: 0.25,
                left: 0.425
            }
        ]
    },
    {
        templateId: 22,
        url: 'https://vimeo.com/714306497',
        previewUrl: '/templates/images/beach6/beach6_540p.jpg',
        name: "Vista Rica",
        maxParticipants: 6,
        description: "Enjoy our Together mode overlooking a beautiful ocean vista",
        type: 'free',
        businessCategories: [
            "Team meeting",
            'Consulting',
            'Coaching',
            "Focused",
            'Restorative',
            'Calming',
            'ASMR'
        ],
        usersPosition: [
            {
                top: 0.25,
                left: 0.575
            },
            {
                top: 0.50,
                left: 0.65
            },
            {
                top: 0.75,
                left: 0.575
            },
            {
                top: 0.75,
                left: 0.425
            },
            {
                top: 0.50,
                left: 0.35
            },
            {
                top: 0.25,
                left: 0.425
            }
        ]
    },
    {
        templateId: 23,
        url: 'https://vimeo.com/719688289',
        previewUrl: '/templates/images/zen_room4/zen_room4_540p.jpg',
        name: "Zen Room",
        maxParticipants: 4,
        description: "Relax in a calm Zen room",
        type: 'free',
        businessCategories: [
            "Counselling",
            'Meditation',
            'Team meeting',
            'Calming',
            'Soothing',
            'ASMR',
        ],
        usersPosition: [
            {
                top: 0.72,
                left: 0.20
            },
            {
                top: 0.76,
                left: 0.385
            },
            {
                top: 0.76,
                left: 0.595
            },
            {
                top: 0.72,
                left: 0.795
            }
        ]
    },
    {
        templateId: 24,
        url: 'https://vimeo.com/719688394',
        previewUrl: '/templates/images/zen_pond4/zen_pond4_540p.jpg',
        name: "Zen Pond",
        maxParticipants: 4,
        description: "Zen out at the edge of a still pond",
        type: 'free',
        businessCategories: [
            "Counselling",
            'Meditation',
            'Team meeting',
            'Calming',
            'Soothing',
            'ASMR',
        ],
        usersPosition: [
            {
                top: 0.72,
                left: 0.20
            },
            {
                top: 0.76,
                left: 0.385
            },
            {
                top: 0.76,
                left: 0.595
            },
            {
                top: 0.72,
                left: 0.795
            }
        ]
    },
    {
        templateId: 25,
        url: 'https://vimeo.com/719922659',
        previewUrl: '/templates/images/heart6/heart6_540p.jpg',
        name: "Breathing Heart Exercise",
        maxParticipants: 6,
        description: "Box Breathing method for anxiety and calm",
        type: 'free',
        businessCategories: [
            'Meditation',
            'Team meeting',
            'Calming',
            'Focused Soothing',
        ],
        usersPosition: [
            {
                top: 0.25,
                left: 0.575
            },
            {
                top: 0.50,
                left: 0.65
            },
            {
                top: 0.75,
                left: 0.575
            },
            {
                top: 0.75,
                left: 0.425
            },
            {
                top: 0.50,
                left: 0.35
            },
            {
                top: 0.25,
                left: 0.425
            }
        ]
    },
    {
        templateId: 26,
        url: 'https://vimeo.com/719937967',
        previewUrl: '/templates/images/abstract6/abstract6_540p.jpg',
        name: "Abstract Solar",
        maxParticipants: 6,
        description: "A soothing background for meetings",
        type: 'free',
        businessCategories: [
            "Team meeting",
            "Consulting",
            "Coaching",
            "Focused",
            "Restorative",
            "Calming"
        ],
        usersPosition: [
            {
                top: 0.25,
                left: 0.575
            },
            {
                top: 0.50,
                left: 0.65
            },
            {
                top: 0.75,
                left: 0.575
            },
            {
                top: 0.75,
                left: 0.425
            },
            {
                top: 0.50,
                left: 0.35
            },
            {
                top: 0.25,
                left: 0.425
            }
        ]
    },
    {
        templateId: 27,
        url: '',
        previewUrl: '/templates/images/calm6/calm6_540p.png',
        name: "Simply Nice",
        maxParticipants: 6,
        description: "A static, professional & calming ambient",
        type: 'free',
        businessCategories: [
            "Team meeting",
            "Consulting",
            "Coaching",
            "Focused",
            "Restorative",
            "Calming"
        ],
        usersPosition: [
            {
                top: 0.25,
                left: 0.575
            },
            {
                top: 0.50,
                left: 0.65
            },
            {
                top: 0.75,
                left: 0.575
            },
            {
                top: 0.75,
                left: 0.425
            },
            {
                top: 0.50,
                left: 0.35
            },
            {
                top: 0.25,
                left: 0.425
            }
        ]
    },
    {
        templateId: 27,
        url: 'https://vimeo.com/689593453',
        previewUrl: '/templates/images/lakeside3/lakeside3_360p.jpg',
        name: 'Lakeside Office (3d Model)',
        maxParticipants: 4,
        description: 'Get inspired in a calming yet energizing environment',
        type: 'free',
        businessCategories: [
            'Counselling',
            'Consulting',
            'Mediation',
            'Team Meeting',
            'Restorative',
            'Calming',
        ],
        usersPosition: [
            {
                top: 0.59,
                left: 0.16
            },
            {
                top: 0.54,
                left: 0.39
            },
            {
                top: 0.54,
                left: 0.59
            },
            {
                top: 0.59,
                left: 0.84
            },
        ]
    }
];