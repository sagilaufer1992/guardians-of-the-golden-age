const fault: Fault = {
    id: "lala",
    distributionCenter: 'מתנ"ס אבו גוש',
    status: "Todo",
    category: "drugs",
    author: {
        name: "שירן",
        role: "manager",
        phone: "050-0000000"
    },
    date: new Date(),
    content: "הספק לא מגיע. הוא אמר שיש לו פנצר ולא הוא לא יכול לבוא. צריך מישהו שיבוא לקחת את המזון מהמחסן"
};

export const faults = [fault, fault, fault];

export const messages: Message[] = [{
    faultId: "lala",
    author: {
        name: "אבי שמעוני",
        role: "hamal",
    },
    content: "הספק לא מגיע. הוא אמר שיש לו פנצר ולא הוא לא יכול לבוא. צריך מישהו שיבוא לקחת את המזון מהמחסן",
    date: new Date()
}, {
    faultId: "lala",
    author: {
        name: "אבי שמעוני",
        role: "hamal",
    },
    content: "הספק לא מגיע. הוא אמר שיש לו פנצר ולא הוא לא יכול לבוא. צריך מישהו שיבוא לקחת את המזון מהמחסן",
    date: new Date()
}]