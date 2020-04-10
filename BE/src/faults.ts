import { getFaultsContainer } from "./cosmosdb";


/**
 * Get all the faults in the database.
 * 
 * @returns Returns all faults from the database.
 */
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


/**
 * Add a new fault to the cosmos database.
 *
 * @param {Fault} fault The fault to add to the database.
 * @returns {Promise<be.Fault>} Returns the newly created fault.
 */
export async function addFault(fault: be.Fault): Promise<be.Fault> {
    const container = getFaultsContainer();
    const { resource: createdItem } = await container.items.create(fault);

    return createdItem;
}


/**
 * Update an existing fault in the database.
 *
 * @param {string} id The id of the fault to update.
 * @param {string} category The category of the fault.
 * @param {Fault} fault The updated fault object.
 * @returns {Promise<be.Fault>} Returns the updated fault in the database.
 */
export async function updateFault(id: string, category: string, fault: be.Fault): Promise<be.Fault> {
    const container = getFaultsContainer();

    const { resource: updatedItem } = await container.item(id, category).replace(fault);

    return updatedItem;
}


/**
 * Delete a fault from the database.
 *
 * @export
 * @param {string} id The id of the fault to delete.
 * @param {string} category The category category of the fault.
 * @returns {Promise<any>} Returns the delete operation result. (not sure what type it is)
 */
export async function deleteFault(id: string, category: string): Promise<any> {
    const container = getFaultsContainer();

    const { resource: result } = await container.item(id, category).delete();

    return result;
}