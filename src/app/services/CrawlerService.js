import axios from 'axios';
import cheerio from 'cheerio';
import  log4js from 'log4js';
import logger from '../../config/logger';

class CrawlerService {

    urlInit = 'https://lista.mercadolivre.com.br';
    products;
    log = logger.app;

    async collect(termo, limit) {
        this.products = [];
        let completed = await this.collectNextPage(`${this.urlInit}/${termo}`, limit);
        this.log.debug('completo: ', completed);
        return this.products;
    }

    async collectNextPage(url, limit) {
        let response = await axios.get(url).catch(function (e) {
            this.log.error(e);
            return false;
        });

        if (response.status == 200) {
            const html = response.data;
            const $ = cheerio.load(html);
            let responseInitialSize = $('#searchResults li.article').length;
            let limitIsGreaterThanResponseSize = limit > responseInitialSize;
            
            let nextPage = $('.pagination__container > ul > li').find('a.prefetch').attr('href');
            this.log.debug('Find nex page: ', nextPage);
            
            $('#searchResults li.article').each((i, element) => {

                if (limit <= 0) {
                    return true;
                }

                let link = $(element).find('a.item__js-link').attr('href').trim();
                let name = $(element).find('span.main-title').text().trim();
                let price = $(element).find('div.item__price > span.price__fraction').text().trim();
                let decimal = $(element).find('div.item__price > span.price__decimals').text();
                let store = $(element).find('span.item__brand-title-tos').text().trim();
                let state = $(element).find('div.item__status > div.item__condition').text().trim();

                let priceComplete = price.replace('.', '') + (decimal != '' ? '.' + decimal : '.00');
                let storeReplaced = store.replace('por', '');
                store = storeReplaced.trim();

                this.products.push({ name, link, "price": priceComplete, store, state });

                limit--;

            });

            if (limit > 0 && nextPage) { 
                this.log.debug('limit: ', limit, 'next page: ', nextPage)
                return this.collectNextPage(nextPage, limit);
            }

            this.log.debug('retornou true ', 'limit: ', limit, 'next page: ', nextPage);

            return true;
        }

        this.log.debug('retornou falso ', 'limit: ', limit, 'next page: ', nextPage);
        return false;
    }

}

export default new CrawlerService();