import Branch from "./branch.model";

export async function getBranches(req, res, next) {
    const branches = await _getRelevantBranches(req.user);
    res.status(200).json(branches);
}

export async function getDistricts(req, res, next) {
    const branches = await _getRelevantBranches(req.user);
    const districts = branches.map(item => item.district);

    res.status(200).json(_removeDuplicates(districts));
}

export async function getNapas(req, res, next) {
    const branches = await _getRelevantBranches(req.user);
    const napas = branches.map(({ district, napa }) => ({ district, napa }));

    res.status(200).json(_removeDuplicates(napas, item => item.napa));
}

export async function getMunicipalities(req, res, next) {
    const branches = await _getRelevantBranches(req.user);
    const municipalities = branches.map(({ district, napa, municipality }) => ({ district, napa, municipality }));

    res.status(200).json(_removeDuplicates(municipalities, item => item.municipality));
}

async function _getRelevantBranches({ role, authGroups }: gg.User) {
    const branches = await Branch.find() as unknown as be.Branch[];

    if (role === "hamal" || role === "admin") return branches;

    return branches.filter(item => authGroups.includes(item.name));
}

function _removeDuplicates<T>(array: T[], getId: (item: T) => any = _ => _) {
    return array.filter(
        (thing, i, arr) => arr.findIndex(t => getId(t) === getId(thing)) === i
    );
}