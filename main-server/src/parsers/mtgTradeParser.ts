import { JSDOM } from 'jsdom';
import http from 'http';

import ICardItem from '@shared/interfaces/ICardItem';

import Logger, { LogLevel } from '../utils/logger';
import Helpers from '../utils/helpers';

const mtgTradeUrl = 'http://mtgtrade.net';

const Selectors = {
  searchResultList: '.search-results-list',
  searchItem: '.search-item',
  saler: '.search-card',
  price: '.catalog-rate-price',
  quantity: '.sale-count',
  cardName: '.catalog-title',
  link: '.catalog-title',
  condition: '.js-card-quality-tooltip',
  cardProperties: '.card-properties',
};

const logger = new Logger('MtgTrade');

const getSearchUrl = (cardName: string): string => {
  return `${mtgTradeUrl}/search/?query=${cardName}`;
};

const searchCard = async (cardName: string): Promise<Document> => {
  /*
  TODO: solve one of:
  1. internal request error for mtgtrade: failed to check first certificate
  2. heroku hangs on this request with {rejectUnauthorized: false} or http protocol

  /* const res = await got(getSearchUrl(cardName), { rejectUnauthorized: true, timeout: 5000 }).catch(error => {
    logger.log(`Failed to get search result for ${getSearchUrl(cardName)}: ${error}`, LogLevel.Error);
    return undefined;
  }); */
  return new Promise((resolve, reject) => {
    const req = http
      .get(getSearchUrl(cardName), res => {
        let html = '';
        res.setEncoding('utf8');
        res.on('data', chunk => {
          html += chunk;
        });
        res.on('end', () => resolve(new JSDOM(html).window.document));
      })
      .on('error', err => {
        logger.log(`Failed to get search result for ${getSearchUrl(cardName)}: ${err.message}`, LogLevel.Error);
        reject(err);
      });
  });
};

const parseSearchResult = (document: Document): Array<ICardItem> => {
  if (!document) return [];

  logger.log('Start parsing search result');

  const searchResultList = document.querySelector(Selectors.searchResultList);
  if (!searchResultList) {
    logger.log('Failed to find search results');
    return [];
  }

  const searchItems = searchResultList.querySelectorAll(Selectors.searchItem);
  if (!searchItems) {
    logger.log('Failed to find search items');
    return [];
  }

  logger.log(`Search items count: ${searchItems.length}`);

  return Array.from(searchItems)
    .map(
      (searchItem: HTMLElement): Array<ICardItem> => {
        const searchCardName = Helpers.queryAndGetText(searchItem, Selectors.cardName);
        const linkRel = Helpers.queryAndGetAttr(searchItem, Selectors.link, 'href');
        const salerItems = searchItem.querySelectorAll(Selectors.saler);
        if (!salerItems) {
          logger.log('Failed to find saler items');
          return [];
        }

        logger.log(`Salers count for card ${searchCardName}: ${salerItems.length}`);

        return Array.from(salerItems)
          .map((item: HTMLElement) => item.querySelector('tbody'))
          .map(
            (salerItem: HTMLElement, index: number): Array<ICardItem> => {
              logger.log(`Parsing price and quantity for saler #${index}`);

              return Array.from(salerItem.querySelectorAll('tr')).map((row: HTMLElement) => {
                return {
                  name: searchCardName,
                  link: linkRel && `${mtgTradeUrl}${linkRel}`,
                  quantity: parseInt(Helpers.queryAndGetText(row, Selectors.quantity)),
                  price: parseInt(Helpers.queryAndGetText(row, Selectors.price)),
                  condition: Helpers.queryAndGetText(row, Selectors.condition),
                  language: Helpers.cleanupString(Helpers.queryAndGetText(row, Selectors.cardProperties).split('|')[0]),
                };
              });
            },
          )
          .reduce((pre, cur) => pre.concat(cur), []);
      },
    )
    .reduce((pre, cur) => pre.concat(cur), []);
};

export default { hostUrl: mtgTradeUrl, searchCard, parseSearchResult };
