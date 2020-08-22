import { JSDOM } from 'jsdom';
import got, { Response } from 'got';
import FormData from 'form-data';

import ICardItem from '@shared/interfaces/ICardItem';
import ISearchResult from '@shared/interfaces/ISearchResult';
import Condition from '@shared/constants/condition';

import { queryAll, query } from '../utils/queryHelpers';
import Logger, { LogLevel } from '../utils/logger';
import { rusNameTo2Code } from '../utils/isoLanguageCodes';

import { shopName, hostUrl, queryCardItem, Selector } from './constants/mtgSale';

const logger = new Logger('MtgSale');

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
      const queryItem = queryCardItem(item);
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
  // TODO: return parsed items if error occured on some page
  return got.paginate
    .all<ICardItem>(`${hostUrl}/home/search-results`, {
      searchParams: {
        Name: cardName,
        Page: 1,
      },
      _pagination: {
        paginate: (response: Response, allItems: Array<ICardItem>, currentItems: Array<ICardItem>) => {
          const url = response.request.options.url;
          const page = Number(url.searchParams.get('Page'));
          logger.log(`Got response for search url: ${url.href}`);

          if (currentItems.length == 0) {
            logger.log(`Search pagination finished on ${page} page`, LogLevel.Debug);
            return false;
          }

          logger.log(`Send search request for page: ${page + 1}`);
          url.searchParams.set('Page', `${page + 1}`);
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
  try {
    const result = await sendSearchCardListRequest(cardNames);
    return parseCardListResult(result);
  } catch (error) {
    logger.log(`Failed to get card list search results: ${error}`, LogLevel.Error);
    return [];
  }
};

export default { shopName, hostUrl, searchCard, searchCardList };
