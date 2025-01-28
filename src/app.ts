
import 'dotenv/config';
import { databases, DataBasesNames, DbConnections } from './interfaces/database.interface';
import { createPlanet, deletePlanets, transaction } from './modules/planets';
import { planetMocks } from './interfaces/planets.interface';
import { closeConection, connectClient, connectDatabase } from './plugins/mongodb-connection.plugin';

const uri: string = process.env.MONGO_URI ?? '';

/**
 * Main method
 */

const main = async () => {
    let dbConnections: DbConnections;
    try {
        await connectClient(uri);
        dbConnections = await connectDatabase(databases);
        console.log(`Connection successfull`);
        /**
         * * Planets collection operations
         */
        const planets = await dbConnections[DataBasesNames.planets]?.collection('planets');
        const searchPlanets = ['Ireta', 'Cassandra', 'Bingo'];
        //updateMars(connection);
        console.log('Deleting...')
        await deletePlanets(planets, searchPlanets);
        console.log('Creating Cassandra...');
        await createPlanet(planets, planetMocks.cassandra);
        console.log('Creating Ireta...');
        await createPlanet(planets, planetMocks.ireta);
        transaction(false);
        const planetsList = await planets?.find({ name: { $in: searchPlanets } }).toArray();
        console.log(planetsList);

        /**
         * * Restaurant collection operations
         */
        const restaurants = await dbConnections[DataBasesNames.restaurants]?.collection('restaurants');
        const restaurantslistByCity = await restaurants?.aggregate([
            /* {
                $match: { borough: 'Brooklyn' },
            }, */
            {
                $group: { 
                    _id: '$borough',
                    totalRestaurants: { $count: {} } 
                }
            },
            {
                $sort: {
                    "_id": 1
                },
            },
            {
                $out: "restaurantsByCity"
            }
        ]).toArray();
        const restaurantsGrades = await restaurants?.aggregate([
            {
                $project: {
                    borough: 1,
                    cuisine: 1,
                    gradesTotal: { $sum: "$grades.score" }
                }
            },
            {
                $set: {
                    cuisine: { $concat: ["$cuisine", " Cuisine"] }
                }
            },
            /* {
                $count: "totalRestaurantsGrades"
            } */
        ]).toArray();
        console.log(`Restaurants: `, restaurantslistByCity, restaurantsGrades);
        const restaurantsByCityCollection = await await dbConnections[DataBasesNames.restaurants]?.collection('restaurantsByCity').find().toArray();
        console.log(restaurantsByCityCollection);
    } catch (error) {
        console.log(`Connection failed ${error}`);
    } finally {
        closeConection();
    }
}

main();