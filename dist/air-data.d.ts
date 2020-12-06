declare type AirState = [
    string,
    string,
    string,
    number,
    number,
    number,
    number,
    number
];
interface AirData {
    time: number;
    states: Array<AirState>;
}
export interface GpsLocation {
    latitude: number;
    longitude: number;
    elevation?: number;
}
export declare function fetchData(): Promise<AirData>;
export declare function createTrackers<T>(data: AirData, factory: (pos: GpsLocation) => T): T[];
export {};
//# sourceMappingURL=air-data.d.ts.map