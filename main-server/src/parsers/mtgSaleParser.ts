import ICardItem from '../interfaces/ICardItem';
import { JSDOM } from 'jsdom';

const mtgSaleUrl = 'https://mtgsale.ru';

const searchResultSelector = '.ctclass';
const priceSelector = '.pprice';
const cardNameSelector = '.tnamec';
const quantitySelector = '.colvo';

const getSearchUrl = (cardName : string) : string => {
    return `${mtgSaleUrl}/home/search-results?Name=${cardName}`;
};

const searchCard = async (cardName : string) : Promise<Document> => {
    return (await JSDOM.fromURL(getSearchUrl(cardName))).window.document;
};

const parseSearchResult = (document : Document) : Array<ICardItem> => {
    const searchResultElems = document.querySelectorAll(searchResultSelector);
    const cardItems = Array.from(searchResultElems).map((item : HTMLElement) => {
        const getPropText = (selector: string): string => {
          const elem = item.querySelector(selector);
          return elem && decodeURIComponent(elem.textContent.replace(/(\r\n|\n|\r)/gm, "").replace(/\s\s+/g, ' ').trim());
        };

        const getPropAttribute = (selector : string, attr : string) : string => {
            const elem = item.querySelector(selector);
            return elem && elem.getAttribute(attr);
        };

        const linkRel = getPropAttribute(cardNameSelector, 'href');

        return {
            name: getPropText(cardNameSelector),
            link: linkRel ? `${mtgSaleUrl}${linkRel}` : undefined,
            quantity: getPropText(quantitySelector),
            price: getPropText(priceSelector)
        };
    });
    return cardItems;
};

export default { searchCard, parseSearchResult };