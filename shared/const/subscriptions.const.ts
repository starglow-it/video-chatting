const houseSubscription = {
    name: "House",
    key: "house",
    features: {
        templatesLimit: 1,
        timeLimit: 120 * 60 * 1000,
        comissionFee: 0.0099,
    }
}

const professionalSubscription = {
    name: "Professional",
    key: "professional",
    features: {
        templatesLimit: 2,
        timeLimit: 1200 * 60 * 1000,
        comissionFee: 0,
    }
}

const businessSubscription = {
    name: "Business",
    key: "business",
    features: {
        templatesLimit: 10,
        timeLimit: null,
        comissionFee: 0,
    }
}

export const plans = {
    "House": houseSubscription,
    "Professional": professionalSubscription,
    "Business": businessSubscription,
}