import { queryConcrete, ConfigItem } from '../../utils/helpers';

export const hostUrl = `https://mtgsale.ru`;
export const shopName = 'MtgSale';

export enum Selector {
  searchResultList = '.ctclass',
  cardListOneResult = '.card_result',
  cardListOneTitle = 'p strong',
}

export const queryCardItem = queryConcrete(
  Object.freeze({
    priceText: new ConfigItem('.pprice', 'text'),
    quantityText: new ConfigItem('.colvo', 'text'),
    cardName: new ConfigItem('.tnamec', 'text'),
    secondCardName: new ConfigItem('.tname .smallfont', 'text'),
    link: new ConfigItem('.tnamec', 'href'),
    condition: new ConfigItem('.sost', 'text'),
    languageRuName: new ConfigItem('.lang i', 'title'),
  }),
);
