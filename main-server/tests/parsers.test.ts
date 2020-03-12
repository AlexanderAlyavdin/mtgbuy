import fs from 'fs';
import { JSDOM } from 'jsdom';
import MtgSale from '../src/parsers/mtgSaleParser';
import MtgTrade from '../src/parsers/mtgTradeParser';
import CardPlace from '../src/parsers/cardPlaceParser';

const mtgSaleTestHtml = fs.readFileSync(`${__dirname}/mtgSaleTestDoc.html`, 'utf-8');
const mtgTradeTestHtml = fs.readFileSync(`${__dirname}/mtgTradeTestDoc.html`, 'utf-8');
const cardPlceTestHtml = fs.readFileSync(`${__dirname}/cardPlaceTestDoc.html`, 'utf-8');

const mtgSaleExpectedResult = [
  {
    name: 'Гоулос, Неутомимый Пилигрим',
    price: 160,
    quantity: 17,
    link: 'https://mtgsale.ru/item/singles/m20_rus/golos-tireless-pilgrim_226',
    condition: 'NM',
    language: 'Русский',
    platform: 'MTG sale',
    platformUrl: 'https://mtgsale.ru',
  },
  {
    name: 'Гоулос, Неутомимый Пилигрим',
    price: 180,
    quantity: 1,
    link: 'https://mtgsale.ru/item/singles/uppck_rus/golos-tireless-pilgrim_57',
    condition: 'NM',
    language: 'Русский',
    platform: 'MTG sale',
    platformUrl: 'https://mtgsale.ru',
  },
];

const mtgTradeExpectedResult = [
  {
    name: 'Golos, Tireless Pilgrim',
    price: 188,
    quantity: 7,
    link: 'https://mtgtrade.net/store/single/Golos%2C+Tireless+Pilgrim/',
    condition: 'NM',
    language: 'ru',
    platform: 'MtgTrade.net',
    platformUrl: 'https://mtgtrade.net',
    trader: 'BGArena',
    traderUrl: 'https://mtgtrade.net/user/25957/',
  },
  {
    name: 'Golos, Tireless Pilgrim',
    price: 174,
    quantity: 12,
    link: 'https://mtgtrade.net/store/single/Golos%2C+Tireless+Pilgrim/',
    condition: 'NM',
    language: 'ru',
    platform: 'MtgTrade.net',
    platformUrl: 'https://mtgtrade.net',
    trader: 'Арена Воронеж',
    traderUrl: 'https://mtgtrade.net/user/12910/',
  },
];

const cardPlaceExpectedResult = [
  {
    name: 'Golos, Tireless Pilgrim',
    price: 903,
    quantity: 0,
    link: 'https://cardplace.ru/item/mtg_m20_golos_tireless_pilgrim_foil_236416/',
    language: 'Английский',
    platform: 'CardPlace.ru',
    platformUrl: 'https://cardplace.ru',
  },
  {
    name: 'Golos, Tireless Pilgrim',
    price: 170,
    quantity: 0,
    link: 'https://cardplace.ru/item/mtg_m20_golos_tireless_pilgrim_236136/',
    language: 'Английский',
    platform: 'CardPlace.ru',
    platformUrl: 'https://cardplace.ru',
  },
];

test('Parsed mtgSale test document has correct card items:', () => {
  const cardItems = MtgSale.parseSearchResult(new JSDOM(mtgSaleTestHtml).window.document);

  expect(cardItems).toStrictEqual(mtgSaleExpectedResult);
});

test('Parsed mtgTrade test document has correct card items:', () => {
  const cardItems = MtgTrade.parseSearchResult(new JSDOM(mtgTradeTestHtml).window.document);

  expect(cardItems).toStrictEqual(mtgTradeExpectedResult);
});

test('Parsed cardPlace test document has corrent card items:', () => {
  const cardItems = CardPlace.parseSearchResult(new JSDOM(cardPlceTestHtml).window.document);

  expect(cardItems).toStrictEqual(cardPlaceExpectedResult);
});
