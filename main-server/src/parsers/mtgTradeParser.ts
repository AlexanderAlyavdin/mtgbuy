import ICardItem from '@shared/interfaces/ICardItem';
import { JSDOM } from 'jsdom';
import got from 'got';

const mtgTradeUrl = 'https://mtgtrade.net';

const searchItemSelector = '.search-item';
const salerSelector = '.search-card';
const priceSelector = '.catalog-rate-price';
const quantitySelector = '.sale-count';

const cardNameSelector = '.catalog-title';
const linkSelector = '.catalog-title';

const writeLog = (msg: string) => {
  console.log(`[MtgTrade]: ${msg}`);
};

const getSearchUrl = (cardName: string): string => {
  return `${mtgTradeUrl}/search/?query=${cardName}`;
};

const getPropText = (item: HTMLElement, selector: string): string => {
  const elem = item.querySelector(selector);
  return (
    elem &&
    elem.textContent
      .replace(/(\r\n|\n|\r)/gm, '')
      .replace(/\s\s+/g, ' ')
      .trim()
  );
};

const getPropAttribute = (item: HTMLElement, selector: string, attr: string): string => {
  const elem = item.querySelector(selector);
  return elem && elem.getAttribute(attr);
};

const searchCard = async (cardName: string): Promise<Document> => {
  const res = await got(getSearchUrl(cardName), { rejectUnauthorized: false });
  return new JSDOM(res.body).window.document;
};

const parseSearchResult = (document: Document): Array<ICardItem> => {
  writeLog('Start parsing for mtgtrade search result');

  const searchResultList = document.querySelector('.search-results-list');
  const searchItems = Array.from(searchResultList.querySelectorAll('.search-item'));

  writeLog(`Search items count: ${searchItems.length}`);

  return searchItems
    .map(
      (searchItem: HTMLElement): Array<ICardItem> => {
        const searchCardName = getPropText(searchItem, cardNameSelector);
        const linkRel = getPropAttribute(searchItem, linkSelector, 'href');
        const salerItems = Array.from(searchItem.querySelectorAll(salerSelector)).map((item: HTMLElement) =>
          item.querySelector('tbody'),
        );

        writeLog(`Salers count for card ${searchCardName}: ${salerItems.length}`);

        return salerItems
          .map(
            (salerItem: HTMLElement, index: number): Array<ICardItem> => {
              writeLog(`Parsing price and quantity for saler #${index}`);

              return Array.from(salerItem.querySelectorAll('tr')).map((row: HTMLElement) => {
                return {
                  name: searchCardName,
                  link: linkRel && `${mtgTradeUrl}${linkRel}`,
                  quantity: getPropText(row, quantitySelector),
                  price: getPropText(row, priceSelector),
                };
              });
            },
          )
          .reduce((pre, cur) => pre.concat(cur));
      },
    )
    .reduce((pre, cur) => pre.concat(cur));
};

export default { searchCard, parseSearchResult };
