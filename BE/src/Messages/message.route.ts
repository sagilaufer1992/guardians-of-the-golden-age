import * as express from "express";
import { getMessages, getMessageById, addMessage, updateMessage, deleteMessage } from "./message.controller";

const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(getMessages)
    .post(addMessage);

router
    .route('/:id')
    .get(getMessageById)
    .put(updateMessage)
    .delete(deleteMessage);

export default router;
