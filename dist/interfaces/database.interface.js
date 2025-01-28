"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databases = exports.DataBasesNames = void 0;
var DataBasesNames;
(function (DataBasesNames) {
    DataBasesNames["planets"] = "planets";
    DataBasesNames["restaurants"] = "restaurants";
})(DataBasesNames || (exports.DataBasesNames = DataBasesNames = {}));
exports.databases = {
    planets: {
        db: 'sample_guides',
        collection: 'planets'
    },
    restaurants: {
        db: 'sample_restaurants',
        collection: 'restaurants'
    },
};
