import { JSDOM } from 'jsdom';

import ICardItem from '@shared/interfaces/ICardItem';

import { queryAll } from '../utils/helpers';
import Logger, { LogLevel } from '../utils/logger';
import { rusNameTo2Code } from '../utils/isoLanguageCodes';

import { hostUrl, shopName, queryCardPlace as query, Selector } from './constants/cardPlace';

const logger = new Logger('CardPlace');

const getSearchUrl = (cardName: string): string =>
  `${hostUrl}/directory/new_search/${encodeURIComponent(cardName)}/mtg/1`;

const searchCard = async (cardName: string): Promise<Document> => {
  logger.log(`Send request: ${getSearchUrl(cardName)}`);
  const dom = await JSDOM.fromURL(getSearchUrl(cardName)).catch(error => {
    logger.log(`Failed to get search result for ${getSearchUrl(cardName)}: ${error}`, LogLevel.Error);
    return undefined;
  });
  if (!dom) return undefined;

  return dom.window.document;
};

const parseSearchResult = (document: Document): Array<ICardItem> => {
  if (!document) return [];

  logger.log('Start parsing search result');

  const searchResultTable = document.querySelector(Selector.searchResultTable);
  if (!searchResultTable) {
    logger.log('Cant find search results');
    return [];
  }

  const searchResults = queryAll(searchResultTable, 'tbody tr');
  return searchResults.map(
    (row: HTMLElement): ICardItem => {
      const queryRow = query(row);

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

export default { shopName, hostUrl, searchCard, parseSearchResult };
