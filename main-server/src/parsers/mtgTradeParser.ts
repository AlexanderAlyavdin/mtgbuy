import { JSDOM } from 'jsdom';
import got from 'got';

import ICardItem from '@shared/interfaces/ICardItem';
import Condition from '@shared/constants/condition';

import Logger, { LogLevel } from '../utils/logger';
import { cleanupString, queryAll } from '../utils/helpers';

import { shopName, hostUrl, queryMtgTrade as query, Selector } from './constants/mtgTrade';

const logger = new Logger('MtgTrade');

const getSearchUrl = (cardName: string): string => `${hostUrl}/search/?query=${encodeURIComponent(cardName)}`;

const searchCard = async (cardName: string): Promise<Document> => {
  const url = getSearchUrl(cardName);
  logger.log(`Send request: ${url}`);
  const res = await got(url, { rejectUnauthorized: false, timeout: 5000 }).catch(error => {
    logger.log(`Failed to get search result for ${url}: ${error}`, LogLevel.Error);
    return undefined;
  });
  return new JSDOM(res.body).window.document;
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
          const link = traderUrlRel
            ? `${hostUrl}/store/single${traderUrlRel}?query=${encodeURIComponent(item.cardName())}`
            : item.link() && `${hostUrl}${item.link()}`;

          return rows
            .map(row => query(row))
            .map(row => {
              return {
                name: item.cardName(),
                link,
                quantity: row.quantity(),
                price: row.price(),
                condition: row.condition() as Condition,
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
