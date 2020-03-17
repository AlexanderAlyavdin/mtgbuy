import { IAdvancedQuery } from './../../utils/IAdvancedQuery';
import { query, queryAll } from '../../utils/helpers';

export const hostUrl = `https://mtgtrade.net`;
export const hostUrlHttp = `http://mtgtrade.net`;
export const shopName = 'MtgTrade.net';

export enum Selector {
  searchResultList = '.search-results-list',
  searchItem = '.search-item',
  seller = '.search-card',
  price = '.catalog-rate-price',
  quantity = '.sale-count',
  cardName = '.catalog-title',
  link = '.catalog-title',
  condition = '.js-card-quality-tooltip',
  cardProperties = '.card-properties',
  traderName = '.trader-name .js-crop-text a',
};

type ModifiedQuery = {
  readonly [ P in keyof typeof Selector]: IAdvancedQuery;
}

export const queryMtgTrade = (root: Element | Document) => {
  const modifiedQuery = {};
  Object.keys(Selector).forEach(key => {
    Object.defineProperty(modifiedQuery, key, {
      get() {
        return query(root, Selector[key]);
      },
    });
  });
  return modifiedQuery as ModifiedQuery;
};
