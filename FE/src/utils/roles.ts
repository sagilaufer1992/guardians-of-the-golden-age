export function isHamal({ role }: gg.UserInfo) {
    return role === "hamal" || role === "admin";
}

export function isVolunteer({ role }: gg.UserInfo) {
    return role === "manager" || role === "volunteer";
}