export const ALL_ITEM = { value: "All", label: "הכל" };

export function toSelect(x: Record<string, string>, withAll?: boolean) {
    const result = Object.entries(x).map(([value, label]) => ({ value, label }));

    return withAll ? [ALL_ITEM, ...result] : result
}