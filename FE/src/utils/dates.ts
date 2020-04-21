import moment from "moment";

export function dayDifference(from: Date, to: Date) {
    return moment(from).startOf("day").diff(moment(to).startOf("day"), "day")
}

export function isToday(date: Date) {
    return moment(date).isSame(moment(), "day");
}