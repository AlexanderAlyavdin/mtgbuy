import { shopName, hostUrl, hostUrlHttp, queryMtgTrade as query, Selector } from './constants/mtgTrade';
import { JSDOM } from 'jsdom';
import http from 'http';

import ICardItem from '@shared/interfaces/ICardItem';

import Logger, { LogLevel } from '../utils/logger';
import { cleanupString, queryAll } from '../utils/helpers';

const logger = new Logger('MtgTrade');

const getSearchUrl = (cardName: string): string => `${hostUrlHttp}/search/?query=${cardName}`;

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

  const searchItems = queryAll(document, `${Selector.searchResultList} ${Selector.searchItem}`);
  if (!searchItems) {
    logger.log('Failed to find search items');
    return [];
  }

  logger.log(`Search items count: ${searchItems.length}`);

  return searchItems.flatMap(
    (searchItem: HTMLElement): Array<ICardItem> => {
      const item = query(searchItem);
      const sellerItems = queryAll(searchItem, Selector.seller);
      if (!sellerItems) {
        logger.log('Failed to find seller items');
        return [];
      }
      logger.log(`sellers count for card ${item.cardName()}: ${sellerItems.length}`);

      return sellerItems.flatMap(
        (sellerItem: HTMLElement, index: number): Array<ICardItem> => {
          logger.log(`Parsing price and quantity for seller #${index}`);

          const rows = queryAll(sellerItem, 'tbody tr');
          const traderUrlRel = query(rows[0]).traderUrl();

          return rows
            .map(row => query(row))
            .map(row => {
              return {
                name: item.cardName(),
                link: item.link() && `${hostUrl}${item.link()}`,
                quantity: row.quantity(),
                price: row.price(),
                condition: row.condition(),
                language: cleanupString(row.cardProperties().split('|')[0]),
                platform: shopName,
                platformUrl: hostUrl,
                trader: query(rows[0]).traderName(),
                traderUrl: traderUrlRel && `${hostUrl}${traderUrlRel}`,
              };
            });
        },
      );
    },
  );
};

export default { shopName, hostUrl, searchCard, parseSearchResult };
