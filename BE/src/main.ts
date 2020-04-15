import * as express from "express";
require('express-async-errors');
import * as cors from "cors";

import initDBConnections from "./cosmosdb";
import { requireAuthMiddleware, userInfoMiddleware } from "./authMiddlewares";

const env = process.env.NODE_ENV = process.env.NODE_ENV || "development";

if (env === "development")
    require("dotenv").config({ path: `.env.${env}` });

(async function () {
    const app = express();
    app.use(express.json());
    app.use(cors());

    app.get("/api/test", (req, res) => res.status(200).send("Server Is Up"));

    await initDBConnections();

    app.post("/api/login", require("./Auth/auth.controller").loginUser);

    app.use(requireAuthMiddleware);

    app.use("/api/auth", require("./Auth/auth.route").default);

    app.use("/api/faults", require("./Faults/fault.route").default);
    app.use("/api/branches", require("./Branches/branch.route").default);
    app.use("/api/messages", require("./Messages/message.route").default);

    const { getDistricts, getNapas, getMunicipalities } = require("./Branches/branch.controller");

    app.get("/api/districts", userInfoMiddleware, getDistricts);
    app.get("/api/napas", userInfoMiddleware, getNapas);
    app.get("/api/municipalities", userInfoMiddleware, getMunicipalities);

    app.listen(8000, () => {
        console.log(`Server is running in http://localhost:8000`)
        console.log(`Running in ${env} environment.`)
    });
})();