import * as mongoose from 'mongoose';

export let faultsDB: mongoose.Connection = null;
export let usersDB: mongoose.Connection = null;

async function _connectDB(connectionString: string) {
    return await mongoose.createConnection(connectionString, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });
};

export default async function initConnections() {
    const { FAULTS_DB_CONN_STRING, USERS_DB_CONN_STRING } = process.env;
    [faultsDB, usersDB] = await Promise.all([FAULTS_DB_CONN_STRING, USERS_DB_CONN_STRING].map(_connectDB));
}