import { JSDOM } from 'jsdom';
import got from 'got';

import ICardItem from '@shared/interfaces/ICardItem';
import ISearchResult from '@shared/interfaces/ISearchResult';

import { queryAll } from '../utils/queryHelpers';
import Logger, { LogLevel } from '../utils/logger';
import { rusNameTo2Code } from '../utils/isoLanguageCodes';

import { hostUrl, shopName, queryCardItem, Selector } from './constants/cardPlace';

const logger = new Logger('CardPlace');

const getSearchUrl = (cardName: string): string =>
  `${hostUrl}/directory/new_search/${encodeURIComponent(cardName)}/mtg/1`;

const sendSearchCardRequest = async (cardName: string): Promise<Document> => {
  const url = getSearchUrl(cardName);
  logger.log(`Send request: ${url}`);
  const res = await got(url).catch(error => {
    logger.log(`Failed to get search result for ${url}: ${error}`, LogLevel.Error);
    return undefined;
  });

  return new JSDOM(res.body).window.document;
};

const parseSearchResult = (document: Document): Array<ICardItem> => {
  if (!document) return [];

  logger.log('Start parsing search result');

  const searchResultTable = document.querySelector(Selector.searchResultTable);
  if (!searchResultTable) {
    logger.log('Cant find search results');
    return [];
  }

  const searchResults = queryAll(searchResultTable, Selector.itemRow);
  return searchResults.map(
    (row: HTMLElement): ICardItem => {
      const queryRow = queryCardItem(row);

      let cardName = queryRow.cardName();
      const language = rusNameTo2Code(queryRow.languageRuName());
      if (language !== 'en') {
        const parenthesesContent = cardName.match(/\((.*?)\)/);
        if (parenthesesContent && parenthesesContent.length >= 2) {
          cardName = parenthesesContent[1];
        }
      }

      return {
        name: cardName,
        link: queryRow.link() && `${hostUrl}${queryRow.link()}`,
        price: parseInt(queryRow.priceText().split(' ')[0]),
        quantity: queryRow.quantity(),
        language,
        platform: shopName,
        platformUrl: hostUrl,
      };
    },
  );
};

const searchCard = async (cardName: string): Promise<Array<ICardItem>> => {
  logger.log(`Search card: ${cardName}`);
  return sendSearchCardRequest(cardName)
    .then(result => parseSearchResult(result))
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
    logger.log(`Failed to get search results for card list: ${error}`, LogLevel.Error);
    return [];
  });
};

const canExplore = (url: string): boolean => {
  return false;
};

export default { shopName, hostUrl, searchCard, searchCardList, canExplore };
