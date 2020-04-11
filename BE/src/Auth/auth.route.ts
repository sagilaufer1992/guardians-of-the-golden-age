import * as express from "express";
import { userInfoMiddleware } from "../authMiddlewares";
import { getUserByToken } from "./auth.controller";

const router = express.Router();
router.use(userInfoMiddleware);

router.route("/").get(getUserByToken);

export default router;
