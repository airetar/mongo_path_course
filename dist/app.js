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
const { ObjectId } = require('bson');
const { connectDatabase, closeConection, connectClient } = require('./plugins');
require('dotenv').config();
require("dotenv/config");
const database_interface_1 = require("./interfaces/database.interface");
const planets_1 = require("./modules/planets");
const planets_interface_1 = require("./interfaces/planets.interface");
const uri = process.env.MONGO_URI;
/**
 * Main method
 */
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    let dbConnections;
    try {
        yield connectClient(uri);
        dbConnections = yield connectDatabase(database_interface_1.databases);
        console.log(`Connection successfull`);
        /**
         * * Planets collection operations
         */
        const planets = yield ((_a = dbConnections[database_interface_1.DataBasesNames.planets]) === null || _a === void 0 ? void 0 : _a.collection('planets'));
        const searchPlanets = ['Ireta', 'Cassandra', 'Bingo'];
        //updateMars(connection);
        console.log('Deleting...');
        yield (0, planets_1.deletePlanets)(planets, searchPlanets);
        console.log('Creating Cassandra...');
        yield (0, planets_1.createPlanet)(planets, planets_interface_1.planetMocks.cassandra);
        console.log('Creating Ireta...');
        yield (0, planets_1.createPlanet)(planets, planets_interface_1.planetMocks.ireta);
        (0, planets_1.transaction)(false);
        const planetsList = yield (planets === null || planets === void 0 ? void 0 : planets.find({ name: { $in: searchPlanets } }).toArray());
        console.log(planetsList);
        /**
         * * Restaurant collection operations
         */
        const restaurants = yield ((_b = dbConnections[database_interface_1.DataBasesNames.restaurants]) === null || _b === void 0 ? void 0 : _b.collection('restaurants'));
        const restaurantslistByCity = yield (restaurants === null || restaurants === void 0 ? void 0 : restaurants.aggregate([
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
        ]).toArray());
        const restaurantsGrades = yield (restaurants === null || restaurants === void 0 ? void 0 : restaurants.aggregate([
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
        ]).toArray());
        console.log(`Restaurants: `, restaurantslistByCity, restaurantsGrades);
        const restaurantsByCityCollection = yield yield ((_c = dbConnections[database_interface_1.DataBasesNames.restaurants]) === null || _c === void 0 ? void 0 : _c.collection('restaurantsByCity').find().toArray());
        console.log(restaurantsByCityCollection);
    }
    catch (error) {
        console.log(`Connection failed ${error}`);
    }
    finally {
        closeConection();
    }
});
main();
