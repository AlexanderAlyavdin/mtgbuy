import ICardItem from '../interfaces/ICardItem';


export const parseMtgSale = ({ dom, pTextsClassName, priceSelector, cardNameSelector, quantitySelector }):Array<ICardItem> => {
  const pTexts = dom.window.document.documentElement.querySelectorAll(`.${pTextsClassName}`);
  return Array.from(pTexts).map((item: HTMLElement) => {
    const getPropText = (selector: string): string => {
      const elem = item.querySelector(selector);
      return elem && elem.textContent.trim();
    }

    const link = item.querySelector(cardNameSelector) && `https://mtgsale.ru/${item.querySelector(cardNameSelector).getAttribute('href')}`;

    return {
      name: getPropText(cardNameSelector),
      link,
      quantity: getPropText(quantitySelector),
      price: getPropText(priceSelector),
    }
  });
};
