import express, { Express, Request, Response, NextFunction } from 'express';
import bodyParser, { json } from 'body-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';

import http from 'http';

import boot from './modules/boot/boot';
import logger from './modules/common/logger/logger';
import errorHandler from './modules/common/errorHandler/errorHandler';

import * as trpcExpress from '@trpc/server/adapters/express';
import type { inferAsyncReturnType } from '@trpc/server';
import { createContext } from './modules/common/router/trpc';

import { initRouter } from './modules/common/router/router';
import { ZodError } from 'zod';

dotenv.config();

const app: Express = express();

app.use(bodyParser.json());
app.use(cors({ origin: process.env.URL_FRONT }));
app.use('/files', express.static('files'));

if (app.get('env') === 'production') {
    app.set('trust proxy', 1);
}

const appRouter = initRouter();

app.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
        router: appRouter,
        createContext,
        onError({ error, type, path }) {
            console.error(`[trpc] path=${path} ; type=${type}`, error);
            logger.logger.error(error.toString());
            // if (error.code === 'INTERNAL_SERVER_ERROR') {
            //
            // }
            if (error.cause instanceof ZodError) {
                // Returning only first zod error message to client
                error.message = JSON.stringify({error : error.cause });
            }
            else {
                error.message = 'Internal server error';
            }
        }
    }),
);

export type AppRouter = typeof appRouter;

const server: http.Server<any> = http.createServer(app);

logger.init();

/*-----------------------------------------Boot start Method--------------------------------------------*/
//boot.start() is a method that is called when the server is booting, 
//it is used for the website to function properly even after a rash restart

boot.start().then((): void => {
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        errorHandler.logErrorMiddleware(err, req, res, next);
    });

    if (server.listen(process.env.PORT || 8080)) {
        logger.logger.info('=========== SERVER STARTED FOR HTTP RQ ===========');
        logger.logger.info('    =============   PORT: 8080   =============');
    }
});