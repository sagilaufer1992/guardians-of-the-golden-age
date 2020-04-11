import * as express from "express";
import { getFaults, getFaultById, addFault, deleteFault, updateFault } from "./fault.controller";
import messagesRouter from "../Messages/message.route";

const router = express.Router();

router.use('/:faultId/messages', messagesRouter);

router
    .route('/')
    .get(getFaults)
    .post(addFault);

router
    .route('/:id')
    .get(getFaultById)
    .put(updateFault)
    .delete(deleteFault);

export default router;
