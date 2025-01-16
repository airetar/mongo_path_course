const { MongoClient } = require('mongodb');

let client;

const connectClient = async (uri) => {
    try {
        client = new MongoClient(uri);
        await client.connect();
        return client;
    } catch (error) {
        throw new Error(`Client connection has failed: ${error}`);
    }
}

const connectDatabase = async (databases) => {
    try {
        let connection;
        if (Object.keys(databases).length) {
            Object.keys(databases).forEach(dbkey => {
                connection = connection
                    ? {
                        ...connection,
                        [dbkey]: client.db(databases[dbkey].db)
                    }
                    : {
                        [dbkey]: client.db(databases[dbkey].db)
                    }
            });
        } else {
            connection = client.db(databases).db;
        }

        return connection;
    } catch (error) {
        throw new Error(`Error on connection to database(s) ${error}`);
    }
}

const getClient = () => {
    return client;
}

const closeConection = () => {
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