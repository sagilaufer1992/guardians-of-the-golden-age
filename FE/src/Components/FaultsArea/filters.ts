import { toSelect, ALL_ITEM } from "../../utils/inputs";
import { statusToText, categoryToText } from "../../utils/translations";

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
        branchName: {
            type: "Autocomplete",
            title: "מרכז חלוקה",
            defaultValue: ALL_ITEM.value,
            options: distributionCenterOptions
        },
        status: {
            type: "DropDown",
            title: "סטטוס",
            defaultValue: ALL_ITEM.value,
            options: [ALL_ITEM, ...toSelect(statusToText)]

        },
        category: {
            type: "DropDown",
            title: "קטגוריה",
            defaultValue: ALL_ITEM.value,
            options: [ALL_ITEM, ...toSelect(categoryToText)]
        }
    }
}

export default getFilters;

