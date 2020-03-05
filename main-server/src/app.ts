import express from 'express';

import config from './config';
import Logger, { LogLevel } from './utils/logger';
import MtgSale from './parsers/mtgSaleParser';
import MtgTrade from './parsers/mtgTradeParser';

const app = express();
const logger = new Logger('App');

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
  logger.log(`Processing search request for card ${cardName}`);

  const mtgSaleSearchPromise = MtgSale.searchCard(cardName).then(result => MtgSale.parseSearchResult(result));
  const mtgTradeSearchPromise = MtgTrade.searchCard(cardName).then(result => MtgTrade.parseSearchResult(result));
  logger.log('Searching on mtgsale and mtgtrade');

  const mtgSaleSearchResult = await mtgSaleSearchPromise.catch(error => {
    logger.log(`Failed to get results from mtgsale: ${error}`, LogLevel.Error);
    return [];
  });

  const mtgTradeSearchResult = await mtgTradeSearchPromise.catch(error => {
    logger.log(`Failed to get results from mtgtrade: ${error}`);
    return [];
  });

  const cardItems = mtgSaleSearchResult.concat(mtgTradeSearchResult);

  logger.log(`Sending result card items: ${cardItems.length} elems`);
  response.send(cardItems);
});

app.listen(config.PORT, () => {
  logger.log(`server is listening on ${config.PORT}`);
});
