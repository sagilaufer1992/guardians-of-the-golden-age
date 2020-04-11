import * as express from "express";
import { getUserInfo } from "../authMiddlewares";
import { getUserByToken } from "./auth.controller";

const router = express.Router();
router.use(getUserInfo);

router.route("/").get(getUserByToken);

export default router;
