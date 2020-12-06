
type AirState = [
    string, // icao24
    string, // callsign
    string, // origin_country
    number, // time_position
    number, // last_contact
    number, // longitude
    number, // latitude
    number, // baro_altitude
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

export async function fetchData(): Promise<AirData> {
    // const resp = await fetch('/data/all.json');
    const resp = await fetch('https://opensky-network.org/api/states/all.json');
    const data = await resp.json();
    console.log(data);
    return data;
}

export function createTrackers<T>(data: AirData, factory: (pos: GpsLocation) => T): T[] {
    const ret: T[] = [];
    data.states.map((s) => {
        // if (i > 100) {
        //     return;
        // }
        const longitude = s[5];
        const latitude = s[6];
        const elevation = s[7];
        if (longitude == null || latitude == null) {
            return;
        }
        ret.push(factory({ longitude, latitude, elevation }));
    });
    return ret;
}
