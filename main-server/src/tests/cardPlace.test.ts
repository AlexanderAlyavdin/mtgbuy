import fs from 'fs';
import { JSDOM } from 'jsdom';

import rewire from 'rewire';

const CardPlace = rewire('../../dist/main-server/src/shops/cardPlace.js');
const parseSearchResult = CardPlace.__get__('parseSearchResult');

const cardSearchTestHtml = fs.readFileSync(`${__dirname}/testFiles/cardPlaceTestDoc.html`, 'utf-8');

const cardSearchExpectedResult = [
  {
    name: 'Golos, Tireless Pilgrim',
    price: 903,
    quantity: 0,
    link: 'https://cardplace.ru/item/mtg_m20_golos_tireless_pilgrim_foil_236416/',
    language: 'en',
    platform: 'CardPlace',
    platformUrl: 'https://cardplace.ru',
  },
  {
    name: 'Golos, Tireless Pilgrim',
    price: 170,
    quantity: 0,
    link: 'https://cardplace.ru/item/mtg_m20_golos_tireless_pilgrim_236136/',
    language: 'en',
    platform: 'CardPlace',
    platformUrl: 'https://cardplace.ru',
  },
];

test('Parsed cardPlace test document has correct card items:', () => {
  const cardItems = parseSearchResult(new JSDOM(cardSearchTestHtml).window.document);

  expect(cardItems).toEqual(cardSearchExpectedResult);
});
