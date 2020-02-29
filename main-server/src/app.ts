import { parseMtgSale } from './parsers/mtgSaleParser';
import express from 'express';
import { JSDOM } from 'jsdom';

const app = express();
const port = process.env.PORT || 3030;

// Avoid CORS
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,x-compress');
    next();
});

app.get('/', (req, response) => {
  const cardName = req.query.cardName;
  JSDOM.fromURL(`https://mtgsale.ru/home/search-results?Name=${cardName}`, {includeNodeLocations: true}).then((dom) => {
      response.send(parseMtgSale({
        dom,
        pTextsClassName: 'ctclass',
        priceSelector: '.pprice',
        cardNameSelector: '.tnamec',
        quantitySelector: '.colvo',
      }));
  });
});

app.listen(port, () => {
  console.log(`server is listening on ${port}`);
});
