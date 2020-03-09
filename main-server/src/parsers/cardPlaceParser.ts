import { JSDOM } from 'jsdom';

import ICardItem from '@shared/interfaces/ICardItem';

import Helpers from '../utils/helpers';
import Logger, { LogLevel } from '../utils/logger';
import { createSecretKey } from 'crypto';
import { link } from 'fs';

const logger = new Logger('CardPlace');
const cardPlaceUrl = 'https://cardplace.ru';

const Selectors = {
  searchResultTable: '.singlestable',
};

const getSearchUrl = (cardName: string): string => {
  return `${cardPlaceUrl}/directory/new_search/${cardName}/mtg/1`;
};

const searchCard = async (cardName: string): Promise<Document> => {
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

  const searchResultTable = document.querySelector(Selectors.searchResultTable);
  if (!searchResultTable) {
    logger.log('Cant find search results');
    return [];
  }

  const searchResults = searchResultTable.querySelector('tbody').querySelectorAll('tr');
  return Array.from(searchResults).map(
    (row: HTMLElement): ICardItem => {
      const columns = row.querySelectorAll('td');
      const nameCol = columns.item(2);
      const priceCol = columns.item(6);
      const quantityCol = columns.item(7);

      const name = Helpers.queryAndGetText(nameCol, 'a');
      const linkRel = Helpers.queryAndGetAttr(nameCol, 'a', 'href');
      const price = Helpers.cleanupString(priceCol.textContent);
      const quantity = Helpers.cleanupString(quantityCol.textContent);

      return {
        name,
        link: linkRel && `${cardPlaceUrl}${linkRel}`,
        price,
        quantity,
      };
    },
  );
};

export default { hostUrl: cardPlaceUrl, searchCard, parseSearchResult };
