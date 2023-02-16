import * as jose from "jose";
import { env } from "../src/env.mjs";

export const decodeToken = async (token: string): Promise<string> => {
    const { payload }: any = await jose.jwtVerify(
        token, new TextEncoder().encode(env.JWT_SECRET)
    );
    return payload;
}