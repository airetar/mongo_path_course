import { Collection, Db, ObjectId, OptionalId } from "mongodb";
import { Planet, planetMocks, Planets } from "../interfaces/planets.interface";
import { closeConection, getClient } from "../plugins/mongodb-connection.plugin";
import { databases } from "../interfaces/database.interface";

/**¨
 * Method to update one document
 */
export const updateMars = async (connection: Db) => {
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

export const createPlanet = async (collection: Collection|undefined, planet: Planet) => {
    try {
        const result = await collection?.insertOne(planet);
        console.log(`Insertion Resume: `, result);
    } catch (error) {
        throw new Error(`Creation of planet has failed: ${error}`);
    }
}

export const deletePlanets = async (collection: Collection|undefined, planets: string[]) => {
    try {
        const result = await collection?.deleteMany(
            { name: { $in: planets } }
        );
        console.log(result);
    } catch (error) {
        throw new Error(`Planets delete error: ${error}`);
    }
}

export const deletePlanet = async (collection: Collection|undefined, objectId: ObjectId) => {
    try {
        const result = await collection?.deleteOne({_id: objectId});
        result && console.log(result);
    } catch (error) {
        throw new Error (`Document can't be deleted ${error}`);
    }
}

export const transaction = async (closeConnectionrequired: boolean) => {
    const client = getClient();
    const planets = client?.db(databases.planets.db).collection('planets');

    const session = client?.startSession();
    console.log(`Start Transaction...`);
    try {
        const transactionResults = await session?.withTransaction(async () => {
            const updateIretaPlanet = await planets?.updateOne(
                { name: 'Ireta' },
                { $set: { hasRings: true } },
                { session }
            );

            console.log(`\n ${updateIretaPlanet?.matchedCount} document(s) matched the filter.\n ${updateIretaPlanet?.modifiedCount} document(s) for the Ireta Planet`);

            const updateCassandraPlanet = await planets?.updateOne(
                { name: 'Cassandra' },
                { $set: { hasRings: true } },
                { session }
            );

            console.log(`\n ${updateCassandraPlanet?.matchedCount} document(s) matched the filter.\n ${updateCassandraPlanet?.modifiedCount} document(s) for the Cassandra Planet`);

            const insertBingosPlanetResult = await planets?.insertOne(planetMocks.bingo, {session});

            console.log(`Successfully inserted ${ insertBingosPlanetResult?.insertedId } into the planets collection`);

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
        await session?.endSession();
        console.log(`Session ended`)
        closeConnectionrequired && await closeConection();
    }

}