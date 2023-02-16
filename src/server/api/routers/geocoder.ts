import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { reverseGeocoderFn } from "../../../../helpers/geocoder.fn";

const geocoderZod = z.object({
    latitude: z.number(),
    longitude: z.number()
});

export const geocoderRouter = createTRPCRouter({
    geocode: publicProcedure.input(geocoderZod).query(async ({ input }) => {
        const { latitude, longitude } = input;
        if (latitude === 0 && longitude === 0) {
            return {
                message: "Loading..."
            }
        }
        const address = await reverseGeocoderFn(latitude, longitude);
        return {
            address
        }
    })
})