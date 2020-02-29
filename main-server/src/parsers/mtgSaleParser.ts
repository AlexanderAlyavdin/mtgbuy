import ICardItem from '../interfaces/ICardItem';
import { JSDOM } from 'jsdom';

const mtgSaleUrl = 'http://mtgsale.ru';

const searchResultSelector = '.ctclass';
const priceSelector = '.pprice';
const cardNameSelector = '.tnamec';
const quantitySelector = '.colvo';

const getSearchUrl = (cardName : string) : string => {
    return `${mtgSaleUrl}/home/search-results?Name=${cardName}`;
};

const parse = async (cardName : string) : Promise<Array<ICardItem>> => {
    const { document } = (await JSDOM.fromURL(getSearchUrl(cardName))).window;
    const searchResultElems = document.querySelectorAll(searchResultSelector);
    const cardItems = Array.from(searchResultElems).map((item : HTMLElement) => {
        const getPropText = (selector: string): string => {
          const elem = item.querySelector(selector);
          return elem && elem.textContent.trim();
        };

        const getPropAttribute = (selector : string, attr : string) : string => {
            const elem = item.querySelector(selector);
            return elem && elem.getAttribute(attr);
        };

        return {
            name: getPropText(cardNameSelector),
            link: `${mtgSaleUrl}/${getPropAttribute(cardNameSelector, 'href')}`,
            quantity: getPropText(quantitySelector),
            price: getPropText(priceSelector)
        };
    });
    return cardItems;
};

export default parse;