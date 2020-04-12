import * as express from "express";
import { getBranches } from "./branch.controller";
import { userInfoMiddleware } from "../authMiddlewares";

const router = express.Router();
router.use(userInfoMiddleware);
router.route("/").get(getBranches);

export default router;
