import fs from 'fs';
import { JSDOM } from 'jsdom';
import MtgSale from '../src/parsers/mtgSaleParser';
import MtgTrade from '../src/parsers/mtgTradeParser';

const mtgSaleTestHtml = fs.readFileSync(`${__dirname}/mtgSaleTestDoc.html`, 'utf-8');
const mtgTradeTestHtml = fs.readFileSync(`${__dirname}/mtgTradeTestDoc.html`, 'utf-8');

const mtgSaleExpectedResult = [
  {
    name: 'Гоулос, Неутомимый Пилигрим',
    price: '160 ₽',
    quantity: '17 шт.',
    link: `${MtgSale.hostUrl}/item/singles/m20_rus/golos-tireless-pilgrim_226`,
  },
  {
    name: 'Гоулос, Неутомимый Пилигрим',
    price: '180 ₽',
    quantity: '1 шт.',
    link: `${MtgSale.hostUrl}/item/singles/uppck_rus/golos-tireless-pilgrim_57`,
  },
];

const mtgTradeExpectedResult = [
  {
    name: 'Golos, Tireless Pilgrim',
    price: '188',
    quantity: '7',
    link: `${MtgTrade.hostUrl}/store/single/Golos%2C+Tireless+Pilgrim/`,
  },
  {
    name: 'Golos, Tireless Pilgrim',
    price: '174',
    quantity: '12',
    link: `${MtgTrade.hostUrl}/store/single/Golos%2C+Tireless+Pilgrim/`,
  },
];

test('Parsed mtgSale test document has correct card items:', async () => {
  const cardItems = MtgSale.parseSearchResult(new JSDOM(mtgSaleTestHtml).window.document);

  expect(cardItems).toStrictEqual(mtgSaleExpectedResult);
});

test('Parsed mtgTrade test document has correct card items:', async () => {
  const cardItems = MtgTrade.parseSearchResult(new JSDOM(mtgTradeTestHtml).window.document);

  expect(cardItems).toStrictEqual(mtgTradeExpectedResult);
});
