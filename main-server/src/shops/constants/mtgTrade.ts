import { queryConcrete, ConfigItem } from '../../utils/queryHelpers';

export const hostUrl = `https://mtgtrade.net`;
export const shopName = 'MtgTrade';

export const UrlRegEx = {
  userSingles: /(http(s)?:\/\/)?mtgtrade\.net\/store\/single\/user\/\d+\/?/,
};

export enum Selector {
  searchResultList = '.search-results-list',
  searchItem = '.search-item',
  seller = '.search-card',
  itemRow = 'tbody tr',
  currentPage = '.pagination-item.current',
  userCardRow = 'tr.card-row.my-collection-card',
  userSinglesRelLink = 'ul.user-edit-form-menu.js-user-edit-form-menu.user-store-menu li:nth-child(1) a',
}

export const queryCardItem = queryConcrete(
  Object.freeze({
    seller: new ConfigItem('.search-card', 'elem'),
    price: new ConfigItem('.catalog-rate-price', 'textAsInt'),
    quantity: new ConfigItem('.sale-count', 'textAsInt'),
    cardName: new ConfigItem('.catalog-title', 'text'),
    link: new ConfigItem('.catalog-title', 'href'),
    condition: new ConfigItem('.js-card-quality-tooltip', 'text'),
    language: new ConfigItem('.lang-item-info', 'title'),
    traderName: new ConfigItem('.trader-name .js-crop-text a', 'text'),
    traderUrl: new ConfigItem('.trader-name .js-crop-text a', 'href'),
  }),
);

export const queryUserCardItem = queryConcrete(
  Object.freeze({
    name: new ConfigItem('td:nth-child(2) a', 'text'),
    imageUrlRel: new ConfigItem('td:nth-child(1) img', 'src'),
  }),
);
