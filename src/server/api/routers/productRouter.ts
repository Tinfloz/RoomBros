import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { decodeJwt, JWTPayload } from "jose";

const listingZod = z.object({
    name: z.string(),
    image: z.string(),
    address: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    rooms: z.string(),
    ratePerNight: z.string(),
    token: z.string()
});

export const productRouter = createTRPCRouter({
    createProduct: publicProcedure.input(listingZod).mutation(async ({ ctx, input }) => {
        const { name, image, address, latitude, longitude, rooms, ratePerNight, token } = input;
        const userId: any = decodeJwt(token)
        console.log(userId.id, "id")
        const owner = await ctx.prisma.owner.findUnique({
            where: {
                userId: userId.id
            }
        });
        const location = {
            type: "Point",
            coordinates: [longitude, latitude]
        };
        const product = await ctx.prisma.posting.create({
            data: {
                name, image, address, rooms: Number(rooms), ratePerNight: Number(ratePerNight), ownerId: owner!.id, location
            }
        });
        if (!product) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "product could not be cerated!"
            })
        };
        return {
            product
        }
    })
});