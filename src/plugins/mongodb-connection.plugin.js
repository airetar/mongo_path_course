const { MongoClient } = require('mongodb');

let client;

const connectDatabase = async (uri, dbName) => {
    try {
        let connection;
        if (!client) {
            client = new MongoClient(uri);
            await client.connect();
            connection = client.db(dbName);
        } else {
            connection = client.db(dbName);
        }
        
        return connection;
    } catch (error) {
        throw new Error('Connection has failed');
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
    connectDatabase,
    closeConection,
    getClient
}