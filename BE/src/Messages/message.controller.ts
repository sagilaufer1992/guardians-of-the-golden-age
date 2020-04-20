import Message from "./message.model"
import Fault from "../Faults/fault.model"

export async function getMessages(req, res, next) {
    if (!req.query.faultId) return res.status(400).send("לא התקבלו תגובות - יש לספק מזהה תקלה");

    const messages = await Message.find({ faultId: req.query.faultId });

    return res.status(200).json(messages);
}

export async function getMessageById(req, res, next) {
    const message = await Message.findById(req.params.id);

    if (!message) {
        return res.status(404).send("לא נמצאה התגובה עם המזהה שנשלח");
    }

    res.status(200).json(message);
}

export async function addMessage(req, res, next) {
    if (!req.query.faultId) return res.status(400).send("שגיאה בהוספת תגובה - יש לציין את מזהה התקלה");

    const { token, branches, ...baseUser } = req.user;

    const fault = await Fault.findById(req.query.faultId);

    if (!fault) {
        return res.status(404).send("שגיאה בהוספת תגובה - לא נמצאה התקלה");
    }

    const message = await Message.create({
        ...req.body,
        author: { ...req.body.author, ...baseUser },
        faultId: fault._id
    });

    res.status(201).json(message);
}

export async function updateMessage(req, res, next) {
    // TODO: not everyone can update messages
    let message = await Message.findById(req.params.id);

    if (!Message) {
        return res.status(404).send("לא קיימת יותר התגובה אותה ניסית לערוך");
    }

    message = await Message.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json(message);
}

export async function deleteMessage(req, res, next) {
    // TODO: not everyone can delete messages
    let message = await Message.findById(req.params.id);

    if (!message)
        return res.status(404).send("שגיאה במחיקת תגובה - לא נמצאה התגובה");

    message.remove();

    res.status(200).json({});
}