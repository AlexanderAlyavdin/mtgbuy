import express from 'express';
import body_parser from 'body-parser';

import config from './config';
import Logger, { LogLevel } from './utils/logger';
import SearchAggregator from './search-aggregator';

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

  logger.log(`Processing search request for card ${cardName}`);

  const cardItems = await SearchAggregator.search(cardName).catch(error => {
    logger.log(`Error occured while searching: ${error}`);
    return [];
  });

  logger.log(`Sending result card items: ${cardItems.length} elems`);
  response.send(cardItems);
});

app.listen(config.PORT, () => {
  logger.log(`server is listening on ${config.PORT}`);
});
