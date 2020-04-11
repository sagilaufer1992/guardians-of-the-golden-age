import * as express from "express";
import { getMessages, getMessageById, addMessage, updateMessage, deleteMessage } from "./message.controller";
import { userInfoMiddleware } from "../authMiddlewares";

const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(getMessages)
    .post(userInfoMiddleware, addMessage);

router
    .route('/:id')
    .get(getMessageById)
    // .put(userInfoMiddleware, updateMessage)
    // .delete(userInfoMiddleware, deleteMessage);

export default router;
