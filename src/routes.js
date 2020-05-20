import { Router } from 'express';
import CrawlerController from './app/controllers/CrawlerController';
import CrawlerValidator from './app/validators/CrawlerValidator'


const routes = new Router();

import CrawlerValidator from './app/validators/CrawlerValidator'
routes.post('/coletar', CrawlerValidator , CrawlerController.collect);

export default routes;