import * as express from "express";
import { getBranches, getBranchFromInfo } from "./branch.controller";
import { userInfoMiddleware } from "../authMiddlewares";

const router = express.Router();
router.use(userInfoMiddleware);

router.route("/").get(getBranches);

router.route("/fromInfo").get(getBranchFromInfo);

export default router;
