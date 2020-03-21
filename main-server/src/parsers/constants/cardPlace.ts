import { queryConcrete, ConfigItem } from '../../utils/helpers';

export const hostUrl = 'https://cardplace.ru';
export const shopName = 'CardPlace.ru';

export const enum Selector {
  searchResultTable = '.singlestable',
}

export const queryCardPlace = queryConcrete(
  Object.freeze({
    priceText: new ConfigItem('td:nth-child(7)', 'text'),
    quantity: new ConfigItem('td:nth-child(8)', 'textAsInt'),
    cardName: new ConfigItem('td:nth-child(3) a', 'text'),
    link: new ConfigItem('td:nth-child(3) a', 'href'),
    language: new ConfigItem('td:nth-child(4) img', 'title'),
  }),
);
