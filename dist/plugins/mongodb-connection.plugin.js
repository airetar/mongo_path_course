"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeConection = exports.getClient = exports.connectDatabase = exports.connectClient = void 0;
const mongodb_1 = require("mongodb");
let client;
const connectClient = (uri) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        client = new mongodb_1.MongoClient(uri);
        yield client.connect();
        return client;
    }
    catch (error) {
        throw new Error(`Client connection has failed: ${error}`);
    }
});
exports.connectClient = connectClient;
const connectDatabase = (databases) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let connections = {
            planets: null,
            restaurants: null
        };
        if (Object.keys(databases).length) {
            Object.keys(databases).forEach(dbkey => {
                connections = connections
                    ? Object.assign(Object.assign({}, connections), { [dbkey]: client === null || client === void 0 ? void 0 : client.db(databases[dbkey].db) }) : {
                    [dbkey]: client === null || client === void 0 ? void 0 : client.db(databases[dbkey].db)
                };
            });
        }
        return connections;
    }
    catch (error) {
        throw new Error(`Error on connection to database(s) ${error}`);
    }
});
exports.connectDatabase = connectDatabase;
const getClient = () => {
    return client;
};
exports.getClient = getClient;
const closeConection = () => {
    if (client) {
        client.close();
        client = null;
    }
};
exports.closeConection = closeConection;
module.exports = {
    connectClient: exports.connectClient,
    connectDatabase: exports.connectDatabase,
    closeConection: exports.closeConection,
    getClient: exports.getClient
};
