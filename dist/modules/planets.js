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
exports.transaction = exports.deletePlanet = exports.deletePlanets = exports.createPlanet = exports.updateMars = void 0;
const mongodb_1 = require("mongodb");
const planets_interface_1 = require("../interfaces/planets.interface");
const mongodb_connection_plugin_1 = require("../plugins/mongodb-connection.plugin");
const database_interface_1 = require("../interfaces/database.interface");
/**¨
 * Method to update one document
 */
const updateMars = (connection) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connection.collection('planets').updateOne({ _id: new mongodb_1.ObjectId('621ff30d2a3e781873fcb65e') }, { $set: { mainAtmosphere: ['CO2', 'Ar', 'N'] } });
        console.log(`Update to Mars Successfull`);
    }
    catch (error) {
        throw new Error(`On Mars Update: ${error}`);
    }
});
exports.updateMars = updateMars;
/**
 *
 * @param {*} connection
 * @param {*} planet
 *
 * Method to create a new document (without no repeat validation)
 */
const createPlanet = (collection, planet) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (collection === null || collection === void 0 ? void 0 : collection.insertOne(planet));
        console.log(`Insertion Resume: `, result);
    }
    catch (error) {
        throw new Error(`Creation of planet has failed: ${error}`);
    }
});
exports.createPlanet = createPlanet;
const deletePlanets = (collection, planets) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (collection === null || collection === void 0 ? void 0 : collection.deleteMany({ name: { $in: planets } }));
        console.log(result);
    }
    catch (error) {
        throw new Error(`Planets delete error: ${error}`);
    }
});
exports.deletePlanets = deletePlanets;
const deletePlanet = (collection, objectId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (collection === null || collection === void 0 ? void 0 : collection.deleteOne({ _id: objectId }));
        result && console.log(result);
    }
    catch (error) {
        throw new Error(`Document can't be deleted ${error}`);
    }
});
exports.deletePlanet = deletePlanet;
const transaction = (closeConnectionrequired) => __awaiter(void 0, void 0, void 0, function* () {
    const client = (0, mongodb_connection_plugin_1.getClient)();
    const planets = client === null || client === void 0 ? void 0 : client.db(database_interface_1.databases.planets.db).collection('planets');
    const session = client === null || client === void 0 ? void 0 : client.startSession();
    console.log(`Start Transaction...`);
    try {
        const transactionResults = yield (session === null || session === void 0 ? void 0 : session.withTransaction(() => __awaiter(void 0, void 0, void 0, function* () {
            const updateIretaPlanet = yield (planets === null || planets === void 0 ? void 0 : planets.updateOne({ name: 'Ireta' }, { $set: { hasRings: true } }, { session }));
            console.log(`\n ${updateIretaPlanet === null || updateIretaPlanet === void 0 ? void 0 : updateIretaPlanet.matchedCount} document(s) matched the filter.\n ${updateIretaPlanet === null || updateIretaPlanet === void 0 ? void 0 : updateIretaPlanet.modifiedCount} document(s) for the Ireta Planet`);
            const updateCassandraPlanet = yield (planets === null || planets === void 0 ? void 0 : planets.updateOne({ name: 'Cassandra' }, { $set: { hasRings: true } }, { session }));
            console.log(`\n ${updateCassandraPlanet === null || updateCassandraPlanet === void 0 ? void 0 : updateCassandraPlanet.matchedCount} document(s) matched the filter.\n ${updateCassandraPlanet === null || updateCassandraPlanet === void 0 ? void 0 : updateCassandraPlanet.modifiedCount} document(s) for the Cassandra Planet`);
            const insertBingosPlanetResult = yield (planets === null || planets === void 0 ? void 0 : planets.insertOne(planets_interface_1.planetMocks.bingo, { session }));
            console.log(`Successfully inserted ${insertBingosPlanetResult === null || insertBingosPlanetResult === void 0 ? void 0 : insertBingosPlanetResult.insertedId} into the planets collection`);
            return true;
        })));
        console.log(`Commiting transaction...`);
        if (transactionResults) {
            console.log(`Transaction was successfully executed`);
        }
        else {
            console.log(`Transaction was intentionally aborted`);
        }
    }
    catch (err) {
        console.log(`Transaction aborted: ${err}`);
        process.exit(1);
    }
    finally {
        yield (session === null || session === void 0 ? void 0 : session.endSession());
        console.log(`Session ended`);
        closeConnectionrequired && (yield (0, mongodb_connection_plugin_1.closeConection)());
    }
});
exports.transaction = transaction;
