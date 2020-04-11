import * as express from "express";
import * as cors from "cors";
import { init as initMongoConnection } from "./cosmosdb";
const env = process.env.NODE_ENV || "development";

require("express-async-errors");

import {
  getFaults,
  getFaultById,
  addFault,
  deleteFault,
  updateFault,
} from "./faults";
import { getBranches } from "./branches";

require("dotenv").config({ path: `.env.${env}` });

const app = express();
app.use(
  express.json({
    type: ["application/json", "text/plain"],
  })
);
app.use(cors());

initMongoConnection();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/branch", async (req, res) => {
  const branches = await getBranches();
  res.json(branches);
});

app.get("/api/fault", async (req, res) => {
  const branches = await getFaults();
  res.json(branches);
});

app.get("/api/fault/:id", async (req, res) => {
  const fault = await getFaultById(req.params.id);
  res.json(fault);
});

app.post("/api/fault", async (req, res) => {
  const faultId = await addFault(req.body);
  res.json({ _id: faultId });
});

app.put("/api/fault/:id", async (req, res) => {
  const affectedDocs = await updateFault(req.params.id, req.body);

  if (affectedDocs === 0) res.status(500);
  else res.status(200);
});

app.delete("/api/fault/:id", async (req, res) => {
  const affectedDocs = await deleteFault(req.params.id);

  if (affectedDocs === 0) res.status(500);
  else res.status(200);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
  console.log(`Running in ${env} environment.`);
});
