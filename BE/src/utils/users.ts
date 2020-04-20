export function isHamal({ role }: gg.User) {
    return role === "hamal" || role === "admin";
}

export function isManager({ role }: gg.User) {
    return role === "manager" || role === "volunteer";
}

export function authGroupsToBranches(authGroups: any): gg.BranchWithMunicipality[] {
    return authGroups.reduce((pv, { city, distributionPoints }) =>
        [...pv, ...distributionPoints.map(name => ({ municipality: city, name }))], []);
}