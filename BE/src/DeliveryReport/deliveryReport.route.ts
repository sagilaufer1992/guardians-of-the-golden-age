import * as express from "express";
import { userInfoMiddleware } from "../authMiddlewares";
import {getDeliveryReport, updateDeliveryReport} from './deliveryReport.controller';

const router = express.Router();

router.use(userInfoMiddleware);

router
    .route('/:branchId/:date')
    .get(getDeliveryReport)
    .put(updateDeliveryReport);

export default router;
