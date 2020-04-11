import * as express from "express";
import { getFaults, getFaultById, addFault, deleteFault, updateFault, getFaultsInDate } from "./fault.controller";
import messagesRouter from "../Messages/message.route";

const router = express.Router();

router.use('/:faultId/messages', messagesRouter);

router.route('/date/:date').get(getFaultsInDate);

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
