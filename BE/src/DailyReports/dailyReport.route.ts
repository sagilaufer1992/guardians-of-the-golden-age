import * as express from "express";
import { getFutureReports } from "./dailyReport.controller";
import { userInfoMiddleware } from "../authMiddlewares";

const router = express.Router();
router.use(userInfoMiddleware);

router.route("/futureReports").post(getFutureReports);

export default router;
