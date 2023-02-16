// import { prisma } from "../../db";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { getAccessToken } from "../../../../helpers/get.access.token";
import { TRPCError } from "@trpc/server";

const authZod = z.object({
    email: z.string(),
    password: z.string(),
    userType: z.string()
})

// auth routes
export const authRouter = createTRPCRouter({
    register: publicProcedure.input(authZod).mutation(async ({ ctx, input }) => {
        const { email, password, userType } = input;

        const userExists = await ctx.prisma.user.findUnique({
            where: {
                email
            }
        });
        if (userExists) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "user already exists"
            })
        }
        const salt = bcrypt.genSaltSync(12);
        const hashedPwd = bcrypt.hashSync(password, salt);
        const user: any = await ctx.prisma.user.create({
            data: {
                email, password: hashedPwd, userType
            }
        })
        const loginUser = userType === "owner" ? await ctx.prisma.owner.create({
            data: {
                userId: user.id
            }
        }) : await ctx.prisma.customer.create({
            data: {
                userId: user.id
            }
        })
        return {
            email,
            userType,
            loginUser,
            token: await getAccessToken(user.id)
        }
    }),
    login: publicProcedure.input(authZod).mutation(async ({ ctx, input }) => {
        const { email, password, userType } = input
        const user: any = await ctx.prisma.user.findUnique({
            where: {
                email
            }
        });
        if (!user) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "user not found"
            })
        };
        if (!bcrypt.compareSync(password, user.password)) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "password incorrect"
            })
        };
        const loginUser = userType === "owner" ? await ctx.prisma.owner.create({
            data: {
                userId: user.id
            }
        }) : await ctx.prisma.customer.create({
            data: {
                userId: user.id
            }
        })
        return {
            email,
            userType,
            loginUser,
            token: await getAccessToken(user.id)
        };
    })
});