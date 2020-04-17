import Fault from "./fault.model";
import Branch from "../Branches/branch.model";

import { MongooseFilterQuery } from "mongoose";
import { getRangeFromDate } from "../utils/dates";

export async function getFaultsInDate(req, res, next) {
    const { date } = req.query;
    const { role, authGroups } = req.user;

    const query: MongooseFilterQuery<be.Fault> = {};

    if (role === "manager" || role === "volunteer")
        query.distributionCenter = { $in: authGroups };

    if (date) {
        const { start, end } = getRangeFromDate(new Date(date));
        query.date = { "$gte": start, "$lt": end };
    }

    const faults = await Fault.find(query);

    res.status(200).json(faults);
}

export async function getFaultById(req, res, next) {
    const fault = await Fault.findById(req.params.id);

    if (!fault) {
        return res.status(404).send("לא נמצאה התקלה המבוקשת");
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
        return res.status(404).send("אירעה שגיאה בעדכון התקלה");
    }
}

export async function deleteFault(req, res, next) {
    const fault = await Fault.findById(req.params.id);
    const { authGroups, role } = req.user as gg.User;

    if (!fault) return res.status(404).json("לא נמצאה התקלה למחיקה");

    const { status, distributionCenter } = fault.toJSON() as be.Fault;

    if (role !== "manager" || !authGroups.includes(distributionCenter)) return res.status(403).json("אין לך הרשאות למחוק תקלה זו");

    if (status !== "Todo") return res.status(400).send("לא ניתן למחוק תקלה לאחר שהתחילו לטפל בה");

    await Fault.findByIdAndRemove(req.params.id);
    res.status(200).json({});
}

export async function faultsStatus(req, res, next) {
    try {
        const { level, value, date } = req.query;
        const query: MongooseFilterQuery<be.Fault> = {};

        console.log(`${level}  ${value}  ${date}`);

        if (date) {
            const end = new Date(date).getTime() + 24 * 60 * 60 * 1000;
            query.date = { "$gte": new Date(date), "$lt": new Date(end) };
        }

        if (level && level !== "national") query[`branch.${level}`] = value;

        console.log(query)

        const total = await Fault.countDocuments(query);
        const open = await Fault.countDocuments({ ...query, status: { $ne: "Complete" } });

        const aggregationQuery = [
            { $match: query },
            {
                "$group": {
                    "_id": {
                        "category": "$category"
                    },
                    "open": {
                        "$sum": {
                            "$switch": {
                                "branches": [
                                    {
                                        "case": { "$ne": ["$status", "Complete"] },
                                        "then": 1
                                    }
                                ],
                                "default": 0
                            }
                        }
                    },
                    "closed": {
                        "$sum": {
                            "$switch": {
                                "branches": [
                                    {
                                        "case": { "$eq": ["$status", "Complete"] },
                                        "then": 1
                                    }
                                ],
                                "default": 0
                            }
                        }
                    }
                }
            }, {
                "$project": {
                    _id: 0,
                    category: "$_id.category",
                    open: 1, closed: 1
                }
            }
        ];

        const reasons = await Fault.aggregate(aggregationQuery);
        res.status(200).json({ total, open, reasons });
    } catch {
        return res.status(500);
    }
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