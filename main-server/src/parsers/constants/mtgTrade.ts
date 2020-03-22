import { queryConcrete, ConfigItem } from '../../utils/helpers';

export const hostUrl = `https://mtgtrade.net`;
export const hostUrlHttp = `http://mtgtrade.net`;
export const shopName = 'MtgTrade';

export enum Selector {
  searchResultList = '.search-results-list',
  searchItem = '.search-item',
  seller = '.search-card',
}

export const queryMtgTrade = queryConcrete(
  Object.freeze({
    seller: new ConfigItem('.search-card', 'elem'),
    price: new ConfigItem('.catalog-rate-price', 'textAsInt'),
    quantity: new ConfigItem('.sale-count', 'textAsInt'),
    cardName: new ConfigItem('.catalog-title', 'text'),
    link: new ConfigItem('.catalog-title', 'href'),
    condition: new ConfigItem('.js-card-quality-tooltip', 'text'),
    cardProperties: new ConfigItem('.card-properties', 'text'),
    traderName: new ConfigItem('.trader-name .js-crop-text a', 'text'),
    traderUrl: new ConfigItem('.trader-name .js-crop-text a', 'href'),
  }),
);
