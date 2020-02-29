import express from 'express';
import config from './config';
import MtgSaleParse from './parsers/mtgSaleParser';

const app = express();

// Avoid CORS
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,x-compress');
    next();
});

app.get('/search', async (req, response) => {
  const cardName = req.query.cardName;
  const cardItems = await MtgSaleParse(cardName);
  response.send(cardItems);
});

app.listen(config.PORT, () => {
  console.log(`server is listening on ${config.PORT}`);
});
