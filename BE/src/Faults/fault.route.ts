import * as express from "express";
import { getFaults, getFaultById, addFault, deleteFault, updateFault } from "./fault.controller";

const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(getFaults)
    .post(addFault);

router
    .route('/:id')
    .get(getFaultById)
    .put(updateFault)
    .delete(deleteFault);

export default router;
