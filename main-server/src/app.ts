import express from 'express';
import body_parser from 'body-parser';

import config from './config';
import Logger, { LogLevel } from './utils/logger';
import SearchAggregator from './searchAggregator';
import CardInfoBase from './utils/cardInfoBase';

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

app.use(body_parser.json());

app.get('/search', async (req, response) => {
  const cardName = req.query.cardName;
  const onStock = req.query.hasOwnProperty('onStock') ? req.query.onStock.toLowerCase() === 'true' : undefined;

  logger.log(`Processing search request for card ${cardName}`);

  const cardItems = await SearchAggregator.search(cardName, onStock).catch(error => {
    logger.log(`Error occured while searching: ${error}`);
    return [];
  });

  logger.log(`Sending result card items: ${cardItems.length} elems`);
  response.send(cardItems);
});

app.get('/suggestions', async (req, response) => {
  const result = await CardInfoBase.autoCompleteName(req.query.partName).catch(error => {
    logger.log(`Error on autocompletion for ${req.query.partName}: ${error}`);
    return [];
  });
  response.send(result);
});

app.get('/cardinfo', async (req, response) => {
  const result = await CardInfoBase.getCardInfo(req.query.cardName).catch(error => {
    logger.log(`Error on getting card info for ${req.query.cardName}: ${error}`);
    return {};
  });
  response.send(result);
});

app.listen(config.PORT, () => {
  logger.log(`server is listening on ${config.PORT}`);
});
