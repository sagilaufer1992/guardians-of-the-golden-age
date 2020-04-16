import * as express from "express";
import { getFaultById, addFault, deleteFault, updateFault, getFaultsInDate, faultsStatus } from "./fault.controller";
import messagesRouter from "../Messages/message.route";
import { userInfoMiddleware } from "../authMiddlewares";

const router = express.Router();

router.use('/:faultId/messages', messagesRouter);

router.use(userInfoMiddleware);

router.route('/status')
    .get(faultsStatus);

router
    .route('/')
    .get(getFaultsInDate)
    .post(addFault);

router
    .route('/:id')
    .get(getFaultById)
    .put(updateFault)
    .delete(deleteFault);

export default router;
