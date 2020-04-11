import { getFaultsCollection } from "./cosmosdb";


/**
 * Get all the faults in the database.
 * 
 * @returns Returns all faults from the database.
 */
export async function getFaults() {
    return await getFaultsCollection().find().toArray();
}


/**
 *  Get a fault by id.
 *
 * @param {string} id The id of the fault.
 * @returns The fault with the given id.
 */
export async function getFaultById(id: string) {
    const collection = getFaultsCollection();

    const result = await collection.findOne({ _id: id });

    return result;
}


/**
 * Add a new fault to the cosmos database.
 *
 * @param {Fault} fault The fault to add to the database.
 * @returns {Promise<string>} Returns the id of the created fault.
 */
export async function addFault(fault: be.Fault): Promise<string> {
    const collection = getFaultsCollection();

    const result = await collection.insertOne({ ...fault, date: new Date(), status: "Todo" });

    return result.insertedId;
}


/**
 * Update an existing fault in the database.
 *
 * @param {string} id The id of the fault to update.
 * @param {Fault} fault The updated fault object.
 * @returns {Promise<number>} Returns the number of affected documents.
 */
export async function updateFault(id: string, fault: be.Fault): Promise<number> {
    const collection = getFaultsCollection();

    const result = await collection.updateOne({ _id: id }, { $set: fault });

    return result.modifiedCount;
}


/**
 * Delete a fault from the database.
 *
 * @param {string} id The id of the fault to delete.
 * @returns {Promise<number>} Returns the number of affected documents.
 */
export async function deleteFault(id: string): Promise<number> {
    const collection = getFaultsCollection();

    const result = await collection.deleteOne({ _id: id });

    return result.deletedCount;
}