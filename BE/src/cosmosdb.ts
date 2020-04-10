
import { MongoClient, Db, Collection } from "mongodb";

const BRANCHES_COLLECTION = "branches";
const FAULTS_COLLECTION = "faults";

let client: MongoClient;
let db: Db;

export function init() {
    client = new MongoClient(process.env.DB_CONN_STRING);

    client.connect(err => {
        if (err !== null) console.error(`Failed to connect to the database. ${err}`);
        else {
            db = client.db(process.env.DB_NAME);
            console.log("successfully connected to the database!")
        }
    });
}

export function getFaultsCollection(): Collection<any> {
    if (db === undefined) init();

    return db.collection(FAULTS_COLLECTION)
}

export function getBranchesCollection(): Collection<any> {
    if (db === undefined) init();

    return db.collection(BRANCHES_COLLECTION);
}