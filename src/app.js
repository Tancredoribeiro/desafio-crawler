import express from 'express';
import helmet from 'helmet';
import logger from './config/logger';

import Youch from 'youch';

import routes from './routes';

class App {

    constructor() {
        this.server = express();
        this.log = logger.error;
        this.middlewares();
        this.routes();
        this.exceptionHandler();
    }

    middlewares() {
        this.server.use(helmet());
        this.server.use(express.json());
        this.server.use(logger.express);
    }

    routes() {
        this.server.use(routes);
    }

    exceptionHandler() {
        this.server.use(async (err, req, res, next) => {
            if (process.env.NODE_ENV === 'development') {
                const errors = await new Youch(err, req).toJSON();
                log.error("Erro 500 dev mode:", err);

                return res.status(500).json(errors);
            }
            log.error("Erro 500:", err);
            return res.status(500).json({ error: 'Internal server error' });
        });
    }

}

export default new App().server;