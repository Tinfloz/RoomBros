import axios from "axios";
import { env } from "../src/env.mjs"

export const reverseGeocoderFn = async (lat: number, lng: number): Promise<string> => {
    const URL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&sensor=true&key=${env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
    const response = await axios(URL).then(async (response) => response.data);
    const addressComponents = response.results[0].address_components;
    const address = `${addressComponents[2].short_name}, ${addressComponents[4].short_name}`;
    return address;
}