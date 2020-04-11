import * as express from "express";
import { getMessages, getMessageById, addMessage, updateMessage, deleteMessage } from "./message.controller";

const router = express.Router({ mergeParams: true });

router
    .route('/')
    .post(addMessage);

router
    .route('/fault/:faultId')
    .get(getMessages);

router
    .route('/:id')
    .get(getMessageById)
    .put(updateMessage)
    .delete(deleteMessage);

export default router;
