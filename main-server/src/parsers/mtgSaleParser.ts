import { JSDOM } from 'jsdom';
import got from 'got';
import FormData from 'form-data';

import ICardItem from '@shared/interfaces/ICardItem';
import ISearchResult from '@shared/interfaces/ISearchResult';
import Condition from '@shared/constants/condition';

import { queryAll, query } from '../utils/helpers';
import Logger, { LogLevel } from '../utils/logger';
import { rusNameTo2Code } from '../utils/isoLanguageCodes';

import { shopName, hostUrl, queryMtgSale, Selector } from './constants/mtgSale';

const logger = new Logger('MtgSale');

const getSearchUrl = (cardName: string): string =>
  `${hostUrl}/home/search-results?Name=${encodeURIComponent(cardName)}`;

const sendSearchCardRequest = async (cardName: string): Promise<Document> => {
  const url = getSearchUrl(cardName);
  logger.log(`Send request: ${url}`);
  const res = await got(url).catch(error => {
    logger.log(`Failed to get search result for ${url}: ${error}`, LogLevel.Error);
    return undefined;
  });

  return new JSDOM(res.body).window.document;
};

const sendSearchCardListRequest = async (cardList: Array<string>): Promise<Document> => {
  const form = new FormData();
  form.append('list', cardList.join('\n'));
  const res = await got
    .post(`${hostUrl}/home/cardlist`, {
      body: form,
      headers: form.getHeaders(),
    })
    .catch(error => {
      logger.log(`Failed to get search result for card list ${form}: ${error}`, LogLevel.Error);
      return undefined;
    });
  return new JSDOM(res.body).window.document;
};

const parseCardListResult = (document: Document): Array<ISearchResult> => {
  if (!document) return [];

  logger.log('Start parsing card list search result');

  const cardResults = queryAll(document, Selector.cardListOneResult);
  if (!cardResults) {
    logger.log('Failed to extract card results');
    return [];
  }

  logger.log(`Card results count: ${cardResults.length}`);

  return Array.from(cardResults).map(
    (item: HTMLElement): ISearchResult => {
      const name = query(item, Selector.cardListOneTitle).text();
      return { cardName: name, searchResult: parseSearchResult(item) };
    },
  );
};

const parseSearchResult = (document: Document | HTMLElement): Array<ICardItem> => {
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
      const queryItem = queryMtgSale(item);
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

const searchCard = async (cardName: string): Promise<Array<ICardItem>> => {
  try {
    const result = await sendSearchCardRequest(cardName);
    return parseSearchResult(result);
  } catch (error) {
    logger.log(`Failed to get search results: ${error}`, LogLevel.Error);
    return [];
  }
};

const searchCardList = async (cardNames: Array<string>): Promise<Array<ISearchResult>> => {
  try {
    const result = await sendSearchCardListRequest(cardNames);
    return parseCardListResult(result);
  } catch (error) {
    logger.log(`Failed to get card list search results: ${error}`, LogLevel.Error);
    return [];
  }
};

export default { shopName, hostUrl, searchCard, searchCardList };
