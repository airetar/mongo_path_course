const { ObjectId } = require('bson');
const { connectDatabase, closeConection } = require('./plugins');
require('dotenv').config();

/**¨
 * Method to update one document
 */
const updateMars = async (connection) => {
    try {
        await connection.collection('planets').updateOne(
            { _id: new ObjectId('621ff30d2a3e781873fcb65e') },
            { $set: { mainAtmosphere: [ 'CO2', 'Ar', 'N'] } }
        );
        console.log(`Update to Mars Successfull`);
    } catch (error) {
        throw new Error(`On Mars Update: ${error}`);
    }
}

/**
 * 
 * @param {*} connection 
 * @param {*} planet 
 * 
 * Method to create a new document (without no repeat validation)
 */
const planetMock = {
    name: 'Ireta',
    orderFromSun: 10,
    hasRings: true,
    mainAtmosphere: [ 'O2', 'Ar', 'N' ],
    surfaceTemperatureC: { min: -89.2, max: 56.7, mean: 14 }
}

const createPlanet = async (connection, planet) => {
    try {
        const result = await connection.collection('planets').insertOne(planetMock);
        console.log(`Inserted: ${planetMock}`);
        console.log(`Resume: ${result}`);
    } catch (error) {
        throw new Error(`Creation of planet has failed`);
    }
}

const deletePlanet = async (collection, objectId) => {
    try {
        const result = await collection.deleteOne({_id: objectId});
        result && console.log(result);
    } catch (error) {
        throw new Error (`Document can't be deleted ${error}`);
    }
}

const uri = process.env.MONGO_URI;

/**
 * Main method
 */


const main = async () => {
    let connection; // connection must have a scope in main so that 'planets' to be able to be sent as parameter in deletePlanet method
    try {
        connection = await connectDatabase(uri, 'sample_guides');
        console.log(`Connection successfull`);
        const planets = await connection.collection('planets');
        const planetsList = await planets.findOne();
        console.log(planetsList);
        //updateMars(connection);
        //createPlanet(connection, planetMock);
        //deletePlanet(planets, new ObjectId('678820f4edf4abe12197bdb7'));
    } catch (error) {
        console.log(`Connection failed ${error}`);
    } finally {
        closeConection();
    }
}

main();