import { getBranchesContainer } from "./cosmosdb";


/**
 * Get all the faults in the database.
 * 
 * @returns Returns all faults from the database.
 */
export async function getBranches() {
    const container = getBranchesContainer();

    const query = {
        query: "SELECT * from c"
    };

    const { resources: faults } = await container.items
        .query(query)
        .fetchAll();

    return faults;
}