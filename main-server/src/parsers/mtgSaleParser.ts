import { JSDOM } from 'jsdom';

import ICardItem from '@shared/interfaces/ICardItem';

import Helpers from '../utils/helpers';
import Logger, { LogLevel } from '../utils/logger';

const logger = new Logger('MtgSale');

const shopName = 'MTG sale';
const hostUrl = 'https://mtgsale.ru';

const Selectors = {
  searchResult: '.ctclass',
  price: '.pprice',
  cardName: '.tnamec',
  link: '.tnamec',
  quantity: '.colvo',
  condition: '.sost',
  language: '.lang',
};

const getSearchUrl = (cardName: string): string => {
  return `${hostUrl}/home/search-results?Name=${cardName}`;
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

  const searchResultElems = document.querySelectorAll(Selectors.searchResult);
  if (!searchResultElems) {
    logger.log('Failed to extract search results');
    return [];
  }

  logger.log(`Search results count: ${searchResultElems.length}`);

  const cardItems = Array.from(searchResultElems).map(
    (item: HTMLElement): ICardItem => {
      const linkRel = Helpers.queryAndGetAttr(item, Selectors.link, 'href');
      const quantity = Helpers.queryAndGetText(item, Selectors.quantity);
      const price = Helpers.queryAndGetText(item, Selectors.price);
      const condition = Helpers.queryAndGetText(item, Selectors.condition);
      const language = Helpers.queryAndGetAttr(item.querySelector(Selectors.language), 'i', 'title');

      return {
        name: Helpers.queryAndGetText(item, Selectors.cardName),
        link: linkRel && `${hostUrl}${linkRel}`,
        quantity: quantity && parseInt(quantity.split(' ')[0]),
        price: price && parseInt(price.split(' ')[0]),
        condition,
        language,
        platform: shopName,
        platformUrl: hostUrl,
      };
    },
  );
  return cardItems;
};

export default { shopName, hostUrl, searchCard, parseSearchResult };
