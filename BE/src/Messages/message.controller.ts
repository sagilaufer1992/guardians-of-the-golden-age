import Message from "./message.model"
import Fault from "../Faults/fault.model"

export async function getMessages(req, res, next) {
    if (req.params.faultId) {
        const messages = await Message.find({ faultId: req.params.faultId });

        return res.status(200).json(messages);
    }

    const messages = await Message.find();

    res.status(200).json(messages);
}

export async function getMessageById(req, res, next) {
    const message = await Message.findById(req.params.id);

    if (!message) {
        return res.status(404, `Message not found with id of ${req.params.id}`);
    }

    res.status(200).json(message);
}

export async function addMessage(req, res, next) {
    req.body.faultId = req.params.faultId;

    const fault = await Fault.findById(req.params.faultId);

    if (!fault) {
        return res.status(404, `No Fault with the id of ${req.params.faultId}`);
    }

    const message = await Message.create(req.body);

    res.status(201).json(message);
}

export async function updateMessage(req, res, next) {
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
    let message = await Message.findById(req.params.id);

    if (!message) {
        return res.status(404, `Message not found with id of ${req.params.id}`);
    }

    message.remove();

    res.status(200).json({});
}