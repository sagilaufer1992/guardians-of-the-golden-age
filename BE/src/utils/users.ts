export function isHamal({ role }: gg.User) {
    return role === "hamal" || role === "admin";
}

export function isManager({ role }: gg.User) {
    return role === "manager" || role === "volunteer";
}