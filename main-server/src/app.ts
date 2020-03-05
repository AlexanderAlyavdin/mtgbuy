import express from 'express';
import config from './config';
import MtgSale from './parsers/mtgSaleParser';
import MtgTrade from './parsers/mtgTradeParser';
import mtgTradeParser from './parsers/mtgTradeParser';

const app = express();

// Avoid CORS
app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append(
    'Access-Control-Allow-Headers',
    'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,x-compress',
  );
  next();
});

app.get('/search', async (req, response) => {
  const cardName = req.query.cardName;
  console.log(`Processing search request for card ${cardName}`);

  const mtgSaleSearchPromise = MtgSale.searchCard(cardName).then(result => MtgSale.parseSearchResult(result));
  const mtgTradeSearchPromise = MtgTrade.searchCard(cardName).then(result => MtgTrade.parseSearchResult(result));
  console.log('Searching on mtgsale and mtgtrade');

  const mtgSaleSearchResult = await mtgSaleSearchPromise;
  const mtgTradeSearchResult = await mtgTradeSearchPromise;
  const cardItems = mtgSaleSearchResult.concat(mtgTradeSearchResult);

  console.log(`Sending result card items: ${cardItems.length} elems`);
  response.send(cardItems);
});

app.listen(config.PORT, () => {
  console.log(`server is listening on ${config.PORT}`);
});
