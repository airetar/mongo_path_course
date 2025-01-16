const { connectClient, connectDatabase, closeConection, getClient } = require('./mongodb-connection.plugin');

module.exports = {
    connectClient,
    connectDatabase,
    closeConection,
    getClient
}