import { JSDOM } from 'jsdom';
import got, { Response } from 'got';
import puppeteer, { Page } from 'puppeteer';

import ICardItem from '@shared/interfaces/ICardItem';
import ISearchResult from '@shared/interfaces/ISearchResult';
import ICardPreview from '@shared/interfaces/ICardPreview';
import Condition from '@shared/constants/condition';

import Logger, { LogLevel } from '../utils/logger';
import { queryAll, query } from '../utils/queryHelpers';
import { rusNameTo2Code } from '../utils/isoLanguageCodes';

import { shopName, hostUrl, queryCardItem, Selector, queryUserCardItem, UrlRegEx } from './constants/mtgTrade';

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
      const item = queryCardItem(searchItem);
      const sellerItems = queryAll(searchItem, Selector.seller);
      if (!sellerItems) {
        logger.log('Failed to find seller items');
        return [];
      }
      logger.log(`Sellers count for card ${item.cardName()}: ${sellerItems.length}`, LogLevel.Debug);

      return sellerItems.flatMap(
        (sellerItem: HTMLElement, index: number): Array<ICardItem> => {
          logger.log(`Parsing price and quantity for seller #${index}`, LogLevel.Debug);

          const rows = queryAll(sellerItem, Selector.itemRow);
          if (rows.length == 0) {
            logger.log(`Result rows are empty`, LogLevel.Warning);
            return [];
          }

          const firstItem = queryCardItem(rows[0]);
          const traderName = firstItem.traderName();
          const traderUrlRel = firstItem.traderUrl();
          const link = traderUrlRel
            ? `${hostUrl}/store/single${traderUrlRel}?query=${encodeURIComponent(item.cardName())}`
            : item.link() && `${hostUrl}${item.link()}`;

          return rows
            .map(row => queryCardItem(row))
            .map(row => ({
              name: item.cardName(),
              link,
              quantity: row.quantity(),
              price: row.price(),
              condition: row.condition() as Condition,
              language: rusNameTo2Code(row.language()),
              platform: shopName,
              platformUrl: hostUrl,
              trader: traderName,
              traderUrl: traderUrlRel && `${hostUrl}${traderUrlRel}`,
            }));
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
        paginate: (response: Response<'text'>, allItems: Array<ICardItem>, currentItems: Array<ICardItem>) => {
          const url = response.request.options.url;
          const page = Number(url.searchParams.get('page'));
          logger.log(`Got response for search url: ${url.href}`);

          if (currentItems.length == 0) {
            logger.log(`Search pagination finished on page ${page}`, LogLevel.Debug);
            return false;
          }

          logger.log(`Send search request for page: ${page + 1}`);
          url.searchParams.set('page', `${page + 1}`);
          return { url };
        },
        transform: (response: Response<'text'>): Array<ICardItem> => {
          const page = Number(response.request.options.url.searchParams.get('page'));
          const dom = new JSDOM(response.body).window.document;
          const currentPage = query(dom, Selector.currentPage).textAsInt();

          // MtgTrade returns last page when page param is larger
          if (page != currentPage) return [];

          return parseSearchResult(new JSDOM(response.body).window.document);
        },
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

const explore = async (url: string, pageNum: Number): Promise<Array<ICardPreview>> => {
  logger.log(`Explore url: ${url}`);

  // Only user singles
  if (!UrlRegEx.userSingles.test(url)) {
    logger.log(`Specified url is not user singles: ${url}`, LogLevel.Error);
    return [];
  }

  const getCardsForPageNum = async (page: Page, pageNum: Number): Promise<Document> => {
    await page.evaluate(`$('.js-store-user-single-form').find('[name="page"]').val(${pageNum})`);
    const resultVarName = 'my_temp_var';
    await page.evaluate(`var ${resultVarName}`);
    await page.evaluate(
      `$('.js-store-user-single-form').ajaxSubmit({success: function(res) { ${resultVarName}=res; }})`,
    );
    await page.waitForFunction(`${resultVarName}`);
    let content = (await page.evaluate(`${resultVarName}`)) as string;
    if (content.includes('var last_page = true;')) {
      logger.log(`Page with number does not exist: ${pageNum}`);
      return undefined;
    }

    content = `<table><tbody>${content}</tbody><table>`;
    return new JSDOM(content).window.document;
  };

  // Set up browser and page.
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  let document: Document;
  try {
    const page = await browser.newPage();
    page.setViewport({ width: 1280, height: 926 });

    await page.goto(url);
    document = await getCardsForPageNum(page, pageNum);
  } catch (error) {
    logger.log(`Error while getting page content: ${error}`, LogLevel.Error);
  } finally {
    await browser.close().catch(error => logger.log(`Failed to close browser: ${error}`, LogLevel.Error));
  }

  const items = parseUserCards(document);

  return items.map(item => {
    const cardOneName = item.name.split('/')[0].trim();
    item.link = `${url}/?query=${encodeURIComponent(cardOneName)}`;
    return item;
  });
};

const parseUserCards = (document: Document): Array<ICardPreview> => {
  const cardRows = queryAll(document, Selector.userCardRow);

  if (cardRows.length == 0) {
    logger.log(`No cards found on page`, LogLevel.Warning);
    return [];
  }

  return cardRows.map(row => {
    const item = queryUserCardItem(row);
    const cardName = item.name();
    return {
      name: cardName,
      imageUrl: `${hostUrl}${item.imageUrlRel()}`,
      link: '',
    };
  });
};

export default { shopName, hostUrl, searchCard, searchCardList, explore };
