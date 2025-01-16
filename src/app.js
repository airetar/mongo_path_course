const { ObjectId } = require('bson');
const { connectDatabase, closeConection, getClient } = require('./plugins');
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
const planetMocks = {
    ireta: {
        name: 'Ireta',
        orderFromSun: 9,
        hasRings: false,
        mainAtmosphere: ['O2', 'Ar', 'N'],
        surfaceTemperatureC: { min: -89.2, max: 56.7, mean: 14 }
    },
    cassandra: {
        name: 'Cassandra',
        orderFromSun: 10,
        hasRings: false,
        mainAtmosphere: ['O2', 'Ar', 'N'],
        surfaceTemperatureC: { min: -89.2, max: 56.7, mean: 14 }
    },
    bingo: {
        name: 'Bingo',
        orderFromSun: 11,
        hasRings: true,
        mainAtmosphere: ['O2', 'Ar', 'N'],
        surfaceTemperatureC: { min: -89.2, max: 56.7, mean: 14 }
    }
}

const createPlanet = async (collection, planet) => {
    try {
        const result = await collection.insertOne(planet);
        console.log(`Insertion Resume: `, result);
    } catch (error) {
        throw new Error(`Creation of planet has failed: ${error}`);
    }
}

const deletePlanets = async (collection, planets) => {
    try {
        const result = await collection.deleteMany(
            { name: { $in: planets } }
        );
        console.log(result);
    } catch (error) {
        throw new Error(`Planets delete error: ${error}`);
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

const transaction = async (closeConnectionrequired) => {
    const client = getClient();
    const planets = client.db(dbName).collection('planets');

    const session = client.startSession();
    console.log(`Start Transaction...`);
    try {
        const transactionResults = await session.withTransaction(async () => {
            const updateIretaPlanet = await planets.updateOne(
                { name: 'Ireta' },
                { $set: { hasRings: true } },
                { session }
            );

            console.log(`\n ${updateIretaPlanet.matchedCount} document(s) matched the filter.\n ${updateIretaPlanet.modifiedCount} document(s) for the Ireta Planet`);

            const updateCassandraPlanet = await planets.updateOne(
                { name: 'Cassandra' },
                { $set: { hasRings: true } },
                { session }
            );

            console.log(`\n ${updateCassandraPlanet.matchedCount} document(s) matched the filter.\n ${updateCassandraPlanet.modifiedCount} document(s) for the Cassandra Planet`);

            const insertBingosPlanetResult = await planets.insertOne(planetMocks.bingo, {session});

            console.log(`Successfully inserted ${ insertBingosPlanetResult.insertedId } into the planets collection`);

            return true;
        });
        console.log(`Commiting transaction...`);
        if (transactionResults) {
            console.log(`Transaction was successfully executed`);
        } else {
            console.log(`Transaction was intentionally aborted`);
        }
    } catch (err) {
        console.log(`Transaction aborted: ${err}`);
        process.exit(1);
    } finally {
        await session.endSession();
        console.log(`Session ended`)
        closeConnectionrequired && await closeConection();
    }

}

const uri = process.env.MONGO_URI;
const dbName = 'sample_guides';

/**
 * Main method
 */


const main = async () => {
    let connection; // connection and planets must have a scope in main so that 'planets' to be able to be sent as parameter in deletePlanet method
    let planets;
    try {
        connection = await connectDatabase(uri, dbName);
        console.log(`Connection successfull`);
        planets = await connection.collection('planets');
        const searchPlanets = ['Ireta', 'Cassandra', 'Bingo'];
        //updateMars(connection);
        console.log('Deleting...')
        await deletePlanets(planets, searchPlanets);
        console.log('Creating Cassandra...');
        await createPlanet(planets, planetMocks.cassandra);
        console.log('Creating Ireta...');
        await createPlanet(planets, planetMocks.ireta);
        transaction(false);

        const planetsList = await planets.find({ name: { $in: searchPlanets } }).toArray();
        console.log(planetsList);
    } catch (error) {
        console.log(`Connection failed ${error}`);
    } finally {
        closeConection();
    }
}

main();