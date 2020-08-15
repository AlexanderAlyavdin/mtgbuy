import { JSDOM } from 'jsdom';
import got from 'got';

import ICardItem from '@shared/interfaces/ICardItem';
import Condition from '@shared/constants/condition';

import { queryAll } from '../utils/helpers';
import Logger, { LogLevel } from '../utils/logger';
import { rusNameTo2Code } from '../utils/isoLanguageCodes';

import { shopName, hostUrl, queryMtgSale as query, Selector } from './constants/mtgSale';

const logger = new Logger('MtgSale');

const getSearchUrl = (cardName: string): string =>
  `${hostUrl}/home/search-results?Name=${encodeURIComponent(cardName)}`;

const searchCard = async (cardName: string): Promise<Document> => {
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

  const searchResultElems = queryAll(document, Selector.searchResultList);
  if (!searchResultElems) {
    logger.log('Failed to extract search results');
    return [];
  }

  logger.log(`Search results count: ${searchResultElems.length}`);

  const cardItems = Array.from(searchResultElems).map(
    (item: HTMLElement): ICardItem => {
      const queryItem = query(item);
      const linkRel = queryItem.link();

      const quantityText = queryItem.quantityText();
      const priceText = queryItem.priceText();
      const language = rusNameTo2Code(queryItem.languageRuName());

      return {
        name: language === 'en' ? queryItem.cardName() : queryItem.secondCardName(),
        link: linkRel && `${hostUrl}${linkRel}`,
        quantity: quantityText && parseInt(quantityText.split(' ')[0]),
        price: priceText && parseInt(priceText.split(' ')[0]),
        condition: queryItem.condition() as Condition,
        language,
        platform: shopName,
        platformUrl: hostUrl,
      };
    },
  );
  return cardItems;
};

export default { shopName, hostUrl, searchCard, parseSearchResult };
