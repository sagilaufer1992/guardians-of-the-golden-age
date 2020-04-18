export const statusToText: Record<FaultStatus, string> = {
    Todo: "תקלות שנפתחו",
    InProgress: "תקלות בתהליך",
    Complete: "תקלות שנסגרו"
};

export const categoryToText: Record<FaultCategory, string> = {
    food: "מחסור בסלי מזון",
    supplier: "בעיה בספק",
    volunteers: "בעיה במתנדבים",
    other: "אחר"
};

export const failRasonToText: Record<FailReason, string> = {
    declined: 'סורב ע"י הנזקק',
    failed: "כישלון בחלוקה"
};

export const progressStatusToText: Record<ProgressStatus, string> = {
    unassigned: "ללא מתנדב",
    notdone: "בתהליך חלוקה"
};