import { JSDOM } from 'jsdom';

import ICardItem from '@shared/interfaces/ICardItem';
import Helpers from '../utils/helpers';
import Logger, { LogLevel } from '../utils/logger';

const logger = new Logger('MtgSale');
const mtgSaleUrl = 'https://mtgsale.ru';

const Selectors = {
  searchResult: '.ctclass',
  price: '.pprice',
  cardName: '.tnamec',
  link: '.tnamec',
  quantity: '.colvo',
};

const getSearchUrl = (cardName: string): string => {
  return `${mtgSaleUrl}/home/search-results?Name=${cardName}`;
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

  const cardItems = Array.from(searchResultElems).map((item: HTMLElement) => {
    const linkRel = Helpers.queryAndGetAttr(item, Selectors.link, 'href');
    const quantity = Helpers.queryAndGetText(item, Selectors.quantity);
    const price = Helpers.queryAndGetText(item, Selectors.price);

    return {
      name: Helpers.queryAndGetText(item, Selectors.cardName),
      link: linkRel && `${mtgSaleUrl}${linkRel}`,
      quantity: quantity && quantity.split(' ')[0],
      price: price && price.split(' ')[0],
    };
  });
  return cardItems;
};

export default { hostUrl: mtgSaleUrl, searchCard, parseSearchResult };
