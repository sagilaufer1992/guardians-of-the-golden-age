import { CosmosClient } from "@azure/cosmos";

const ENDPOINT = "https://zahav.documents.azure.com:443/";
const KEY = "MszShRrozxUpWdqMUNikn7YKt40yICnVpqLI39aBEeYXePAAQjB0XzIbrXfgfZQov6vczmVJVxh5WP0Tmt3Few==";

const DATABASE_ID = "TestDB";
const FAULTS_CONTAINER_ID = "faults";
const BRANCHES_CONTAINER_ID = "branches";

const CLIENT = new CosmosClient({ endpoint: ENDPOINT, key: KEY  });
const DATABASE = CLIENT.database(DATABASE_ID);

export function getFaultsContainer() {
    return DATABASE.container(FAULTS_CONTAINER_ID);
}

export function getBranchesContainer() {
    return DATABASE.container(BRANCHES_CONTAINER_ID);
}