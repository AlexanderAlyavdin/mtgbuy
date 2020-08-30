import fs from 'fs';
import { JSDOM } from 'jsdom';

import rewire from 'rewire';

const MtgSale = rewire('../../dist/main-server/src/shops/mtgSale.js');
const parseSearchResult = MtgSale.__get__('parseSearchResult');
const parseCardListResult = MtgSale.__get__('parseCardListResult');

const cardSearchTestHtml = fs.readFileSync(`${__dirname}/testFiles/mtgSaleTestDoc.html`, 'utf-8');
const cardListSearchTestHtml = fs.readFileSync(`${__dirname}/testFiles/mtgSaleCardListTestDoc.html`, 'utf-8');

const cardSearchExpectedResult = [
  {
    name: 'Golos, Tireless Pilgrim',
    price: 160,
    quantity: 17,
    link: 'https://mtgsale.ru/item/singles/m20_rus/golos-tireless-pilgrim_226',
    condition: 'NM',
    language: 'ru',
    platform: 'MtgSale',
    platformUrl: 'https://mtgsale.ru',
  },
  {
    name: 'Golos, Tireless Pilgrim',
    price: 180,
    quantity: 1,
    link: 'https://mtgsale.ru/item/singles/uppck_rus/golos-tireless-pilgrim_57',
    condition: 'NM',
    language: 'ru',
    platform: 'MtgSale',
    platformUrl: 'https://mtgsale.ru',
  },
];

const cardListSearchExpectedResult = [
  {
    cardName: 'Golos, Tireless Pilgrim',
    searchResult: [
      {
        name: 'Golos, Tireless Pilgrim',
        price: 1970,
        quantity: 0,
        link: 'https://mtgsale.ru/item/singles/prerp_eng/golos-tireless-pilgrim_2157',
        condition: 'NM',
        language: 'en',
        platform: 'MtgSale',
        platformUrl: 'https://mtgsale.ru',
      },
      {
        name: 'Golos, Tireless Pilgrim',
        price: 530,
        quantity: 0,
        link: 'https://mtgsale.ru/item/singles/uppck_eng/golos-tireless-pilgrim_57',
        condition: 'NM',
        language: 'en',
        platform: 'MtgSale',
        platformUrl: 'https://mtgsale.ru',
      },
      {
        name: 'Golos, Tireless Pilgrim',
        price: 290,
        quantity: 0,
        link: 'https://mtgsale.ru/item/singles/m20_eng/golos-tireless-pilgrim_226',
        condition: 'NM',
        language: 'en',
        platform: 'MtgSale',
        platformUrl: 'https://mtgsale.ru',
      },
      {
        name: 'Golos, Tireless Pilgrim',
        price: 290,
        quantity: 12,
        link: 'https://mtgsale.ru/item/singles/m20_rus/golos-tireless-pilgrim_226',
        condition: 'NM',
        language: 'ru',
        platform: 'MtgSale',
        platformUrl: 'https://mtgsale.ru',
      },
    ],
  },
  {
    cardName: 'Sisay, Weatherlight Captain',
    searchResult: [
      {
        condition: 'NM',
        language: 'en',
        link: 'https://mtgsale.ru/item/singles/mh1_eng/sisay-weatherlight-captain_29',
        name: 'Sisay, Weatherlight Captain',
        platform: 'MtgSale',
        platformUrl: 'https://mtgsale.ru',
        price: 36,
        quantity: 0,
      },
      {
        condition: 'NM',
        language: 'ru',
        link: 'https://mtgsale.ru/item/singles/mh1_rus/sisay-weatherlight-captain_29',
        name: 'Sisay, Weatherlight Captain',
        platform: 'MtgSale',
        platformUrl: 'https://mtgsale.ru',
        price: 36,
        quantity: 7,
      },
      {
        condition: 'SP',
        language: 'ru',
        link: 'https://mtgsale.ru/item/singles/mh1_rus/sisay-weatherlight-captain_29',
        name: 'Sisay, Weatherlight Captain',
        platform: 'MtgSale',
        platformUrl: 'https://mtgsale.ru',
        price: 32,
        quantity: 1,
      },
    ],
  },
];

test('Parsed mtgSale test document has correct card items:', () => {
  const cardItems = parseSearchResult(new JSDOM(cardSearchTestHtml).window.document);

  expect(cardItems).toEqual(cardSearchExpectedResult);
});

test('Parsed mtgTrade card list test document has correct items:', () => {
  const result = parseCardListResult(new JSDOM(cardListSearchTestHtml).window.document);

  expect(result).toEqual(cardListSearchExpectedResult);
});
