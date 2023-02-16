import { createTRPCRouter } from "./trpc";
import { authRouter } from "./routers/authRouter";
import { productRouter } from "./routers/productRouter";
import { geocoderRouter } from "./routers/geocoder";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  product: productRouter,
  geocoder: geocoderRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
