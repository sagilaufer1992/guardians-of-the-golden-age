import * as express from "express";
import { getBranches } from "./branch.controller";

const router = express.Router();

router.route("/").get(getBranches);

export default router;
