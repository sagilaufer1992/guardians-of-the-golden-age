import Branch from "./branch.model";

export async function getBranches(req, res, next) {
    const branches = await Branch.find();
    res.status(200).json(branches);
}

export async function getDistricts(req, res, next) {
    const branches = await Branch.find() as unknown as be.Branch[];
    const districts = branches.map(item => item.district);

    res.status(200).json(_removeDuplicates(districts));
}

export async function getNapas(req, res, next) {
    const branches = await Branch.find() as unknown as be.Branch[];
    const napas = branches.map(({ district, napa }) => ({ district, napa }));

    res.status(200).json(_removeDuplicates(napas, item => item.napa));
}

export async function getMunicipalities(req, res, next) {
    const branches = await Branch.find() as unknown as be.Branch[];
    const municipalities = branches.map(({ district, napa, municipalityName, municipalitySymbol }) => ({ district, napa, municipalityName, municipalitySymbol }));

    res.status(200).json(_removeDuplicates( municipalities, item => item.municipalitySymbol));
}

function _removeDuplicates<T>(array: T[], getId: (item: T) => any = _ => _) {
    return array.filter(
        (thing, i, arr) => arr.findIndex(t => getId(t) === getId(thing)) === i
    );
}