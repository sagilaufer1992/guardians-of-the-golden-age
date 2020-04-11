export const statusToText: Record<FaultStatus, string> = {
    Todo: "תקלות שנפתחו",
    InProgress: "תקלות בתהליך",
    Complete: "תקלות שנסגרו"
};

export const categoryToText: Record<FaultCategory, string> = {
    food: "מחסור בסלי מזון",
    drugs: "מחסור בתרופות",
    other: "אחר"
};