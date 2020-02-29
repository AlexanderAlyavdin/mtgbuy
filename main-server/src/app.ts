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
      const pTexts = dom.window.document.documentElement.getElementsByClassName('ctclass');
      const items = [];
      for (let i = 0; i < pTexts.length; i++) {
          const item = pTexts.item(i);

          const priceElem = item.querySelector('.pprice'); 
          const cardNameElem = item.querySelector('.tnamec');
          const quantityElem = item.querySelector('.colvo');

          let price = null;
          let name = null;
          let link = null;
          let quantity = null;

          if (priceElem) {
            price = priceElem.textContent.trim();
          }
          if (cardNameElem) {
              name = cardNameElem.textContent.trim();
              link = 'https://mtgsale.ru/' + cardNameElem.getAttribute('href');
          }
          if (quantityElem) {
              quantity = quantityElem.textContent.trim();
          }
          items.push({'price': price, 'name': name, 'link': link, 'quantity': quantity});
      }
      response.send(items);
  });
});

app.listen(port, () => {
  console.log(`server is listening on ${port}`);
});
