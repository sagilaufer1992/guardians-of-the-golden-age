import * as express from "express";
import { userInfoMiddleware } from "../authMiddlewares";
import { getDeliveryReport, updateDeliveryReport, incrementDeliveryReport } from './deliveryReport.controller';

const router = express.Router();

router.use(userInfoMiddleware);

router
    .route('/:branchId/:date')
    .get(getDeliveryReport)
    .put(updateDeliveryReport)

router
    .route('/:branchId/:date/increment')
    .put(incrementDeliveryReport);

export default router;
