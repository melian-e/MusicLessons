import { publicProcedure, router } from '../common/router/trpc';
import { z } from "zod";
import Example from "./example";
import example from './example';


export function initExampleRouter() {
    return router({
        example: publicProcedure
            .input(z.object({
                token: z.string(),
                date: z.date(),
            }))
            .query(async ({ input }) => {
                console.log("example");

                return await example.example(input.token, input.date);
            }),
    });
}