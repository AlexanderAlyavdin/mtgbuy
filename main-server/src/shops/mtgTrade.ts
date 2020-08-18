import { JSDOM } from 'jsdom';
import got, { Response } from 'got';

import ICardItem from '@shared/interfaces/ICardItem';
import ISearchResult from '@shared/interfaces/ISearchResult';
import Condition from '@shared/constants/condition';

import Logger, { LogLevel } from '../utils/logger';
import { queryAll } from '../utils/helpers';
import { rusNameTo2Code } from '../utils/isoLanguageCodes';

import { shopName, hostUrl, queryMtgTrade as query, Selector } from './constants/mtgTrade';

const logger = new Logger('MtgTrade');

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
                language: rusNameTo2Code(row.language()),
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

const searchCard = async (cardName: string): Promise<Array<ICardItem>> => {
  return got.paginate
    .all<ICardItem>(`${hostUrl}/search`, {
      rejectUnauthorized: false,
      timeout: 10000,
      searchParams: {
        query: cardName,
        page: 1,
      },
      _pagination: {
        paginate: (response: Response, allItems: Array<ICardItem>, currentItems: Array<ICardItem>) => {
          const url = response.request.options.url;
          const page = Number(url.searchParams.get('page'));
          logger.log(`Got response for search url: ${url.href}`);

          if (currentItems.length == 0) {
            logger.log(`Search pagination finished on ${page} page`, LogLevel.Debug);
            return false;
          }

          logger.log(`Send search request for page: ${page + 1}`);
          url.searchParams.set('page', `${page + 1}`);
          return { url };
        },
        transform: (response: Response<'text'>): Array<ICardItem> =>
          parseSearchResult(new JSDOM(response.body).window.document),
      },
    })
    .catch(error => {
      logger.log(`Failed to get search results: ${error}`, LogLevel.Error);
      return [];
    });
};

const searchCardList = async (cardNames: Array<string>): Promise<Array<ISearchResult>> => {
  logger.log(`Search card list: ${cardNames}`);
  return await Promise.all(
    cardNames.map(async (cardName: string) => {
      const result = await searchCard(cardName);
      return { cardName, searchResult: result };
    }),
  ).catch(error => {
    logger.log(`Failed to get card list search results: ${error}`, LogLevel.Error);
    return [];
  });
};

export default { shopName, hostUrl, searchCard, searchCardList };
