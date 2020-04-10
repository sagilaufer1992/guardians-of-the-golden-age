const fault = {
    id: "lala",
    title: 'מתנ"ס אבו גוש',
    status: "Todo",
    category: "drugs",
    user: {
        name: "שירן",
        phone: "050-0000000",
        email: "shiran@walla.com"
    },
    date: new Date(),
    hierarchy: "להלה",
    chatHistory: [{
        name: "אבי שמעוני",
        role: "DistributionManager",
        content: "הספק לא מגיע. הוא אמר שיש לו פנצר ולא הוא לא יכול לבוא. צריך מישהו שיבוא לקחת את המזון מהמחסן",
        date: new Date()
    }, {
        name: "אבי שמעוני",
        role: "Hamal",
        content: "הספק לא מגיע. הוא אמר שיש לו פנצר ולא הוא לא יכול לבוא. צריך מישהו שיבוא לקחת את המזון מהמחסן",
        date: new Date()
    }, {
        name: "אבי שמעוני",
        role: "Hamal",
        content: "הספק לא מגיע. הוא אמר שיש לו פנצר ולא הוא לא יכול לבוא. צריך מישהו שיבוא לקחת את המזון מהמחסן",
        date: new Date()
    }]
} as Fault;

const faults = [fault, fault, fault];

export default faults;
