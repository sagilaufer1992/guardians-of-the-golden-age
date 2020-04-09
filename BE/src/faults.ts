import { getFaultsContainer } from "./cosmosdb";

export async function getFaults() {
    const container = getFaultsContainer();

    const query = {
        query: "SELECT * from c"
    };

    const { resources: faults } = await container.items
        .query(query)
        .fetchAll();

    return faults;
}