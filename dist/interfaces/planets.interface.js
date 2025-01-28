"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.planetMocks = void 0;
exports.planetMocks = {
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
};
