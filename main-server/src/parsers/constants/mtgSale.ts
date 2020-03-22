import { queryConcrete, ConfigItem } from '../../utils/helpers';

export const hostUrl = `https://mtgsale.ru`;
export const shopName = 'MTG sale';

export enum Selector {
  searchResultList = '.ctclass',
}

export const queryMtgSale = queryConcrete(
  Object.freeze({
    priceText: new ConfigItem('.pprice', 'text'),
    quantityText: new ConfigItem('.colvo', 'text'),
    cardName: new ConfigItem('.tnamec', 'text'),
    link: new ConfigItem('.tnamec', 'href'),
    condition: new ConfigItem('.sost', 'text'),
    languageRuName: new ConfigItem('.lang i', 'title'),
  }),
);
