// TODO: assumes user sends start of day
export function getRangeFromDate(start: Date) {
    const end = new Date(+start + 24 * 60 * 60 * 1000);

    return { start, end };
}