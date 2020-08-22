import fs from 'fs';
import { JSDOM } from 'jsdom';

import rewire from 'rewire';

const MtgTrade = rewire('../../dist/main-server/src/shops/mtgTrade.js');
const parseSearchResult = MtgTrade.__get__('parseSearchResult');
const parseUserCards = MtgTrade.__get__('parseUserCards');

const cardSearchTestHtml = fs.readFileSync(`${__dirname}/testFiles/mtgTradeTestDoc.html`, 'utf-8');
const userSinglesTestHtml = fs.readFileSync(`${__dirname}/testFiles/mtgTradeUserSingles.html`, 'utf-8');

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

const userSinglesExpectedResult = [
  {
    name: 'Heat Shimmer / Жаркий Отблеск',
    imageUrl: 'https://mtgtrade.net/cards/lw/175.jpg',
    link: 'https://mtgtrade.net/store/single/user/11077//?query=Heat%20Shimmer',
  },
  {
    name: 'Hero of Goma Fada / Герой из Гома-Фада',
    imageUrl: 'https://mtgtrade.net/cards/ptc/269.jpg',
    link: 'https://mtgtrade.net/store/single/user/11077//?query=Hero%20of%20Goma%20Fada',
  },
];

test('Parsed mtgTrade test document has correct card items:', () => {
  const cardItems = parseSearchResult(new JSDOM(cardSearchTestHtml).window.document);

  expect(cardItems).toEqual(cardSearchExpectedResult);
});

test('User singles parse result has correct items', () => {
  const items = parseUserCards(
    new JSDOM(userSinglesTestHtml).window.document,
    'https://mtgtrade.net/store/single/user/11077/',
  );

  expect(items).toEqual(userSinglesExpectedResult);
});
