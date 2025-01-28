import { MongoClient } from "mongodb";
import { DataBases, DbConnections } from "../interfaces/database.interface";

let client: MongoClient | null;

export const connectClient = async (uri: string) => {
    try {
        client = new MongoClient(uri);
        await client.connect();
        return client;
    } catch (error) {
        throw new Error(`Client connection has failed: ${error}`);
    }
}

export const connectDatabase = async (databases: DataBases) => {
    try {
        let connections: DbConnections = {
            planets: null,
            restaurants: null
        };
        if (Object.keys(databases).length) {
            Object.keys(databases).forEach(dbkey => {
                connections = connections
                    ? {
                        ...connections,
                        [dbkey]: client?.db(databases[dbkey as keyof DataBases].db)
                    }
                    : {
                        [dbkey]: client?.db(databases[dbkey as keyof DataBases].db)
                    }
            });
        }

        return connections;
    } catch (error) {
        throw new Error(`Error on connection to database(s) ${error}`);
    }
}

export const getClient = (): MongoClient|null => {
    return client;
}

export const closeConection = (): void => {
    if (client) {
        client.close();
        client = null;
    }
}

module.exports = {
    connectClient,
    connectDatabase,
    closeConection,
    getClient
}