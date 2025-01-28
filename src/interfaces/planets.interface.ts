export interface Planets {
    ireta:     Planet;
    cassandra: Planet;
    bingo:     Planet;
}

export interface Planet {
    name:                string;
    orderFromSun:        number;
    hasRings:            boolean;
    mainAtmosphere:      string[];
    surfaceTemperatureC: SurfaceTemperatureC;
}

export interface SurfaceTemperatureC {
    min:  number;
    max:  number;
    mean: number;
}

export const planetMocks: Planets = {
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