import fs from 'fs';
import { JSDOM } from 'jsdom';
import MtgSale from '../src/parsers/mtgSaleParser';

const testHtml = fs.readFileSync(`${__dirname}/mtgSaleTestDoc.html`, 'utf-8');

const expectedResult = [
    {
        name: 'Гоулос, Неутомимый Пилигрим',
        price: '160 ₽',
        quantity: '17 шт.',
        link: 'https://mtgsale.ru/item/singles/m20_rus/golos-tireless-pilgrim_226'
    },
    {
        name: 'Гоулос, Неутомимый Пилигрим',
        price: '180 ₽',
        quantity: '1 шт.',
        link: 'https://mtgsale.ru/item/singles/uppck_rus/golos-tireless-pilgrim_57'
    }
];

test('Parsed mtgSale test document has correct card items:', async () => {
    const cardItems = MtgSale.parseSearchResult(new JSDOM(testHtml).window.document);
    
    expect(cardItems).toStrictEqual(expectedResult);
});