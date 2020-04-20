export const ALL_ITEM = { value: "All", label: "הכל" };

export function toSelect<T extends string = string>(x: Record<T, string>, withAll?: boolean): Array<{ value: T, label: string }> {
    const result = Object.entries(x).map(([value, label]) => ({ value, label }));

    return withAll ? [ALL_ITEM, ...result] : result as any;
}