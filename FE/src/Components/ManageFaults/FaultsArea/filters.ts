import { toSelect, ALL_ITEM } from "../../../utils/inputs";

export const statuses: Record<FaultStatus, string> = {
    Todo: "תקלות שנפתחו",
    InProgress: "תקלות בתהליך",
    Complete: "תקלות שנסגרו"
};

export const categories: Record<FaultCategory, string> = {
    food: "מחסור בסלי מזון",
    drugs: "מחסור בתרופות",
    other: "אחר"
};

function getFilters(branches: Branch[]): Record<string, FilterDefinition> {
    const districts = Array.from(new Set(branches.map(b => b.district)));

    const districtsOptions = [ALL_ITEM, ...districts.map(b => ({ value: b, label: b }))];
    const distributionCenterOptions = [ALL_ITEM, ...branches.map(b => ({ value: b.name, label: b.name }))];

    return {
        district: {
            type: "DropDown",
            title: "מחוז",
            defaultValue: ALL_ITEM.value,
            options: districtsOptions
        },
        distributionCenter: {
            type: "Autocomplete",
            title: "מרכז חלוקה",
            defaultValue: ALL_ITEM.value,
            options: distributionCenterOptions
        },
        status: {
            type: "DropDown",
            title: "סטטוס",
            defaultValue: ALL_ITEM.value,
            options: [ALL_ITEM, ...toSelect(statuses)]

        },
        category: {
            type: "DropDown",
            title: "קטגוריה",
            defaultValue: ALL_ITEM.value,
            options: [ALL_ITEM, ...toSelect(categories)]
        }
    }
}

export default getFilters;

