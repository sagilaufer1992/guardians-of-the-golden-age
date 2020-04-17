import * as express from "express";
import { createFutureReports, getDailyReport } from "./dailyReport.controller";
import { userInfoMiddleware } from "../authMiddlewares";

const router = express.Router();
router.use(userInfoMiddleware);

router.get("/", getDailyReport)
router.route("/futureReports").post(createFutureReports);

export default router;
