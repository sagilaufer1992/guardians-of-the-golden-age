import * as express from "express";
import { getBranches, getBranchFromValue } from "./branch.controller";
import { userInfoMiddleware } from "../authMiddlewares";

const router = express.Router();
router.use(userInfoMiddleware);

router.route("/").get(getBranches);

router.route("/fromValue").get(getBranchFromValue);

export default router;
