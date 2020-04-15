import Fault from "./fault.model";
import Branch from "../Branches/branch.model";

import { MongooseFilterQuery } from "mongoose";

export async function getFaultsInDate(req, res, next) {
    const { date } = req.query;
    const { role, authGroups } = req.user;

    const query: MongooseFilterQuery<be.Fault> = {};

    if (role === "manager" || role === "volunteer")
        query.distributionCenter = { $in: authGroups };

    if (date) {
        const end = new Date(date).getTime() + 24 * 60 * 60 * 1000;
        query.date = { "$gte": new Date(date), "$lt": new Date(end) };
    }

    const faults = await Fault.find(query);

    res.status(200).json(faults);
}

export async function getFaultById(req, res, next) {
    const fault = await Fault.findById(req.params.id);

    if (!fault) {
        return res.status(404).send(`Fault not found with id of ${req.params.id}`);
    }

    res.status(200).json(fault);
}

export async function addFault(req, res, next) {
    const { token, authGroups, ...baseUser } = req.user;
    const distributionCenter = req.body.distributionCenter;

    let newFault = {
        ...req.body,
        author: { ...req.body.author, ...baseUser }
    };

    const branchDocument = await _getBranch(distributionCenter);

    if (branchDocument) {
        const { _id, ...branch } = branchDocument.toJSON();
        newFault.branch = branch;
    }

    const fault = await Fault.create(newFault);

    res.status(201).json(fault);
}

export async function updateFault(req, res, next) {
    try {
        const fault = await Fault.findOneAndUpdate({ _id: req.params.id }, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json(fault);
    }
    catch {
        return res.status(404).send(`Fault not found with id of ${req.params.id}`);
    }
}

export async function deleteFault(req, res, next) {
    const fault = await Fault.findById(req.params.id);
    const { authGroups, role } = req.user as gg.User;

    if (!fault) return res.status(404).json(`Fault not found with id of ${req.params.id}`);

    const { status, distributionCenter } = fault.toJSON() as be.Fault;

    if (role !== "manager" || !authGroups.includes(distributionCenter)) return res.status(403).json("Not Allowed");

    if (status !== "Todo") return res.status(400).send("You can delete only when status is Todo");

    await Fault.findByIdAndRemove(req.params.id);
    res.status(200).json({});
}

async function _getBranch(name: string) {
    if (!name) return null;

    try {
        const branch = await Branch.findOne({ "name": { $eq: name } });
        return branch;
    }
    catch{
        return null;
    }
}