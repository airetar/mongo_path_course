const { connectDatabase, closeConection } = require('./mongodb-connection.plugin');

module.exports = {
    connectDatabase,
    closeConection
}