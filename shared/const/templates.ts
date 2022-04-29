import {ICommonTemplate} from "../interfaces/common-template.interface";

interface BaseTemplate extends Omit<ICommonTemplate, 'businessCategories'> {
    businessCategories: string[];
}

export const templatesData: BaseTemplate[] = [
    {
        templateId: 1,
        url: 'https://vimeo.com/691226035',
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
                top: 0.45,
                left: 0.23
            },
            {
                top: 0.45,
                left: 0.54
            },
        ]
    },
    {
        templateId: 2,
        url: 'https://vimeo.com/691226099',
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
                top: 0.50,
                left: 0.15
            },
            {
                top: 0.45,
                left: 0.40
            },
            {
                top: 0.5,
                left: 0.65
            }
        ]
    },
    {
        templateId: 3,
        url: 'https://vimeo.com/691226161',
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
                top: 0.5,
                left: 0.13
            },
            {
                top: 0.45,
                left: 0.35
            },
            {
                top: 0.45,
                left: 0.55
            },
            {
                top: 0.5,
                left: 0.70
            }
        ]
    },
    {
        templateId: 4,
        url: 'https://vimeo.com/691227155',
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
                top: 0.5,
                left: 0.12
            },
            {
                top: 0.45,
                left: 0.32
            },
            {
                top: 0.45,
                left: 0.55
            },
            {
                top: 0.5,
                left: 0.7
            }
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
                top: 0.44,
                left: 0.15
            },
            {
                top: 0.45,
                left: 0.45
            },
            {
                top: 0.42,
                left: 0.72
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
                top: 0.40,
                left: 0.11
            },
            {
                top: 0.40,
                left: 0.45
            },
            {
                top: 0.40,
                left: 0.79
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
                top: 0.47,
                left: 0.11
            },
            {
                top: 0.47,
                left: 0.80
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
                top: 0.70,
                left: 0.13
            },
            {
                top: 0.66,
                left: 0.26
            },
            {
                top: 0.66,
                left: 0.40
            },
            {
                top: 0.66,
                left: 0.58
            },
            {
                top: 0.68,
                left: 0.74
            },
            {
                top: 0.69,
                left: 0.87
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
                top: 0.48,
                left: 0.33
            },
            {
                top: 0.57,
                left: 0.13
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
                top: 0.54,
                left: 0.56
            },
            {
                top: 0.62,
                left: 0.80
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
                top: 0.50,
                left: 0.60
            },
            {
                top: 0.56,
                left: 0.30
            },
            {
                top: 0.70,
                left: 0.38
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
                top: 0.40,
                left: 0.51
            },
            {
                top: 0.58,
                left: 0.28
            },
            {
                top: 0.58,
                left: 0.78
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
                top: 0.40,
                left: 0.51
            },
            {
                top: 0.45,
                left: 0.45
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
                top: 0.72,
                left: 0.6
            },
            {
                top: 0.65,
                left: 0.26
            },
            {
                top: 0.85,
                left: 0.35
            },
            {
                top: 0.80,
                left: 0.60
            },
            {
                top: 0.70,
                left: 0.78
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
                top: 0.60,
                left: 0.35
            },
            {
                top: 0.60,
                left: 0.57
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
                top: 0.60,
                left: 0.35
            },
            {
                top: 0.60,
                left: 0.57
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
                top: 0.60,
                left: 0.35
            },
            {
                top: 0.60,
                left: 0.57
            }
        ]
    }
];