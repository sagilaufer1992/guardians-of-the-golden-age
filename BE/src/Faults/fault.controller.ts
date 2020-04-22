import { MongooseFilterQuery } from "mongoose";
import Fault from "./fault.model";
import Branch from "../Branches/branch.model";

import { getRangeFromDate } from "../utils/dates";
import { isManager, getBranchIdentifier } from "../utils/users";

export async function getFaultsInDate(req, res, next) {
    const { date } = req.query;
    const { branches } = req.user;

    const query: MongooseFilterQuery<be.Fault> = {};

    if (isManager(req.user))
        query["branch.identifier"] = { $in: branches.map(getBranchIdentifier) };

    if (date) {
        const { start, end } = getRangeFromDate(new Date(date));
        query.date = { "$gte": start, "$lt": end };
    }

    const faults = await Fault.find(query);

    res.status(200).json(faults);
}

export async function getFaultById(req, res, next) {
    const fault = await Fault.findById(req.params.id);

    if (!fault) return res.status(404).send("לא נמצאה התקלה המבוקשת");

    res.status(200).json(fault);
}

export async function addFault(req, res, next) {
    const { token, branches, ...baseUser }: gg.User = req.user;
    const [municipality, name] = req.body.distributionCenter.split("|");

    if (!branches.some(_ => _.name === name && _.municipality === municipality))
        return res.status(403).send("אינך מורשה לפתוח תקלה בנקודת חלוקה זו");

    const newFault: be.Fault = {
        ...req.body,
        author: { ...req.body.author, ...baseUser },
        branch: { name, municipality, identifier: getBranchIdentifier({ name, municipality }) }
    };

    const branchDocument = await Branch.findOne({ municipality });

    if (branchDocument) {
        newFault.branch.district = branchDocument.district;
        newFault.branch.napa = branchDocument.napa;
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

        if (!fault) throw new Error();

        res.status(200).json(fault);
    }
    catch {
        return res.status(404).send("אירעה שגיאה בעדכון התקלה");
    }
}

export async function deleteFault(req, res, next) {
    const fault = await Fault.findById(req.params.id);
    const { branches, role } = req.user as gg.User;

    if (!fault) return res.status(404).send("לא נמצאה התקלה למחיקה");

    const branchId = getBranchIdentifier(fault.branch);

    if (role !== "manager" || !branches.some(b => getBranchIdentifier(b) === branchId))
        return res.status(403).send("אין לך הרשאות למחוק תקלה זו");

    if (fault.status !== "Todo") return res.status(400).send("לא ניתן למחוק תקלה לאחר שהתחילו לטפל בה");

    await Fault.findByIdAndRemove(req.params.id);

    res.status(200).json({});
}

export async function faultsStatus(req, res, next) {
    try {
        const { level, value, date } = req.query;
        const query: MongooseFilterQuery<be.Fault> = {};

        if (date) {
            const end = new Date(date).getTime() + 24 * 60 * 60 * 1000;
            query.date = { "$gte": new Date(date), "$lt": new Date(end) };
        }

        if (level && level !== "national") query[`branch.${level}`] = value;

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