import Branch from "./branch.model";

export async function getBranches(req, res, next) {
    const branches = await Branch.find();

    res.status(200).json(branches);
}