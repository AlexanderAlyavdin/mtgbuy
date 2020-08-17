import fs from 'fs';
import { JSDOM } from 'jsdom';

import rewire from 'rewire';

const MtgTrade = rewire('../dist/main-server/src/shops/mtgTrade.js');
const parseSearchResult = MtgTrade.__get__('parseSearchResult');

const cardSearchTestHtml = fs.readFileSync(`${__dirname}/mtgTradeTestDoc.html`, 'utf-8');

const cardSearchExpectedResult = [
  {
    name: 'Golos, Tireless Pilgrim',
    price: 188,
    quantity: 7,
    link: 'https://mtgtrade.net/store/single/user/25957/?query=Golos%2C%20Tireless%20Pilgrim',
    condition: 'NM',
    language: 'ru',
    platform: 'MtgTrade',
    platformUrl: 'https://mtgtrade.net',
    trader: 'BGArena',
    traderUrl: 'https://mtgtrade.net/user/25957/',
  },
  {
    name: 'Golos, Tireless Pilgrim',
    price: 174,
    quantity: 12,
    link: 'https://mtgtrade.net/store/single/user/12910/?query=Golos%2C%20Tireless%20Pilgrim',
    condition: 'NM',
    language: 'ru',
    platform: 'MtgTrade',
    platformUrl: 'https://mtgtrade.net',
    trader: 'Арена Воронеж',
    traderUrl: 'https://mtgtrade.net/user/12910/',
  },
];

test('Parsed mtgTrade test document has correct card items:', () => {
  const cardItems = parseSearchResult(new JSDOM(cardSearchTestHtml).window.document);

  expect(cardItems).toEqual(cardSearchExpectedResult);
});
