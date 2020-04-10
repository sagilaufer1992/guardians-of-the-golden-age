import { getBranchesCollection } from "./cosmosdb";

/**
 * Get all the branches in the database.
 * 
 * @returns Returns all branches from the database.
 */
export async function getBranches() { return await getBranchesCollection().find().toArray() }