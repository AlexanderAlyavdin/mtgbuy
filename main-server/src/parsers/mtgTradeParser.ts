import { shopName, hostUrl, hostUrlHttp, Selectors } from './constants/mtgTrade';
import { JSDOM } from 'jsdom';
import http from 'http';

import ICardItem from '@shared/interfaces/ICardItem';

import Logger, { LogLevel } from '../utils/logger';
import { cleanupString, query, queryAll } from '../utils/helpers';

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

  const searchItems = queryAll(document, `${Selectors.searchResultList} ${Selectors.searchItem}`);
  if (!searchItems) {
    logger.log('Failed to find search items');
    return [];
  }

  logger.log(`Search items count: ${searchItems.length}`);

  return searchItems.flatMap((searchItem: HTMLElement): Array<ICardItem> => {
    const searchCardName = query(searchItem, Selectors.cardName).text;
    const linkRel = query(searchItem, Selectors.link).href;
    const sellerItems = queryAll(searchItem, Selectors.seller);
    if (!sellerItems) {
      logger.log('Failed to find seller items');
      return [];
    }

    logger.log(`sellers count for card ${searchCardName}: ${sellerItems.length}`);

    return sellerItems.flatMap((sellerItem: HTMLElement, index: number): Array<ICardItem> => {
      logger.log(`Parsing price and quantity for seller #${index}`);

      const rows = queryAll(sellerItem, 'tbody tr');
      const traderUrlRel = query(rows[0], Selectors.traderName).href;

      return rows.map((row: HTMLElement) => ({
        name: searchCardName,
        link: linkRel && `${hostUrl}${linkRel}`,
        quantity: query(row, Selectors.quantity).textAsInt,
        price: query(row, Selectors.price).textAsInt,
        condition: query(row, Selectors.condition).text,
        language: cleanupString(query(row, Selectors.cardProperties).text.split('|')[0]),
        platform: shopName,
        platformUrl: hostUrl,
        trader: query(rows[0], Selectors.traderName).text,
        traderUrl: traderUrlRel && `${hostUrl}${traderUrlRel}`,
      }));
    });
  });
};

export default { shopName, hostUrl, searchCard, parseSearchResult };
