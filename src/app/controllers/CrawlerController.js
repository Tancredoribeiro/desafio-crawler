import Crawlerservice from '../services/CrawlerService'
import logger from '../../config/logger';
class CrawlerController {

    async collect(req, res) {
        let log = logger.app;
        const { search, limit } = req.body;

        const products = await Crawlerservice.collect(search, limit);
        log.debug('produtos size', products.length);
        return res.json(products);
    }
}

export default new CrawlerController();