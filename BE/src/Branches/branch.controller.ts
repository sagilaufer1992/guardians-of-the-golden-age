import Branch from "./branch.model";
import { isHamal } from "../utils/users";
import { MongooseFilterQuery } from "mongoose";

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

export async function getBranchFromInfo(req, res, next) {
    const { napa, district, municipality, name } = req.query;

    const query: MongooseFilterQuery<be.Branch> = {};
    if (district) query.district = district;
    if (napa) query.napa = napa;
    if (municipality) query.municipality = municipality;
    if (name) query.name = name;

    const result = await Branch.findOne(query);
    if (!result) return res.status(404).send("לא נמצאו פרטי מרכז החלוקה");

    res.status(200).json(result);
}

async function _getRelevantBranches(user: gg.User) {
    if (isHamal(user)) return await Branch.find();

    return await Branch.find({
        name: { $in: user.branches.map(_ => _.name) },
        municipality: { $in: user.branches.map(_ => _.municipality) }
    });
}

function _removeDuplicates<T>(array: T[], getId: (item: T) => any = _ => _) {
    return array.filter(
        (thing, i, arr) => arr.findIndex(t => getId(t) === getId(thing)) === i
    );
}