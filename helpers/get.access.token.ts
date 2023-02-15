import * as jose from "jose";
import { env } from "../src/env.mjs";

export const getAccessToken = async (id: string): Promise<string> => {
    const token = await new jose.SignJWT({ id })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('30d')
        .sign(new TextEncoder().encode(env.JWT_SECRET))
    return token
};