const { connectDatabase, closeConection, getClient } = require('./mongodb-connection.plugin');

module.exports = {
    connectDatabase,
    closeConection,
    getClient
}