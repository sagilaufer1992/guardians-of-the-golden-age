import * as express from "express";
require('express-async-errors');

import * as cors from "cors";
import connectDB from "./cosmosdb";
import faultsRouter from "./Faults/fault.route";
import branchesRouter from "./Branches/branch.route";
import messagesRouter from "./Messages/message.route";
import { getDistricts, getNapas, getMunicipalities } from "./Branches/branch.controller";


const env = process.env.NODE_ENV || "development";

require("dotenv").config({ path: `.env.${env}` });

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

app.use("/api/faults", faultsRouter);
app.use("/api/branches", branchesRouter);
app.use("/api/messages", messagesRouter);

app.get("/api/districts", getDistricts);
app.get("/api/napas", getNapas);
app.get("/api/municipalities", getMunicipalities);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running in http://localhost:${PORT}`)
    console.log(`Running in ${env} environment.`)
});