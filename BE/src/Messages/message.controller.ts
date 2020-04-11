import Message from "./message.model"
import Fault from "../Faults/fault.model"

export async function getMessages(req, res, next) {
    if (!req.query.faultId) return res.status(400, "Must supply fault id");

    const messages = await Message.find({ faultId: req.query.faultId });

    return res.status(200).json(messages);
}

export async function getMessageById(req, res, next) {
    const message = await Message.findById(req.params.id);

    if (!message) {
        return res.status(404, `Message not found with id of ${req.params.id}`);
    }

    res.status(200).json(message);
}

export async function addMessage(req, res, next) {
    if (!req.query.faultId) return res.status(400, "Must supply fault id");

    const { token, authGroups, ...baseUser } = req.user;

    const fault = await Fault.findById(req.query.faultId);

    if (!fault) {
        return res.status(404, `No Fault with the id of ${req.body.faultId}`);
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
        return res.status(404, `Message not found with id of ${req.params.id}`);
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

    if (!message) {
        return res.status(404, `Message not found with id of ${req.params.id}`);
    }

    message.remove();

    res.status(200).json({});
}