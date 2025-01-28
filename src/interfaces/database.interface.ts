import { Db } from "mongodb";

export enum DataBasesNames {
    planets = 'planets',
    restaurants = 'restaurants'
}

export interface DataBase {
    db: string;
    collection: string;
}

export interface DataBases {
    [DataBasesNames.planets]: DataBase;
    [DataBasesNames.restaurants]: DataBase;
}

export interface DbConnections {
    [DataBasesNames.planets]?: Db|null,
    [DataBasesNames.restaurants]?: Db|null
}

export const databases: DataBases = {
    planets: {
        db: 'sample_guides',
        collection: 'planets'
    },
    restaurants: {
        db: 'sample_restaurants',
        collection: 'restaurants'
    },
};