import * as express from "express";
import * as cors from "cors";
import connectDB from "./cosmosdb";
import faultsRouter from "./Faults/fault.route";
import branchesRouter from "./Branches/branch.route";
require('express-async-errors');

const env = process.env.NODE_ENV || "development";

require("dotenv").config({ path: `.env.${env}` });

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

app.use("/api/fault", faultsRouter);
app.use("/api/branch", branchesRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running in http://localhost:${PORT}`)
    console.log(`Running in ${env} environment.`)
});