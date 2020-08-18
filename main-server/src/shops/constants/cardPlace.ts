import { queryConcrete, ConfigItem } from '../../utils/helpers';

export const hostUrl = 'https://cardplace.ru';
export const shopName = 'CardPlace';

export const enum Selector {
  searchResultTable = '.singlestable',
  itemRow = 'tbody tr',
}

export const queryCardItem = queryConcrete(
  Object.freeze({
    priceText: new ConfigItem('td:nth-child(7)', 'text'),
    quantity: new ConfigItem('td:nth-child(8)', 'textAsInt'),
    cardName: new ConfigItem('td:nth-child(3) a', 'text'),
    link: new ConfigItem('td:nth-child(3) a', 'href'),
    languageRuName: new ConfigItem('td:nth-child(4) img', 'title'),
  }),
);
