import express from 'express';
import getHtmlByCardName from './utils/parsers/mtgsale-parser';

const app = express();
const port = 3030;

// Avoid CORS
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,x-compress');
    next();
});

app.get('/', (req, res) => {
  const cardName = req.params.cardName;
  const result = getHtmlByCardName(cardName);
  res.send(result);
});
app.listen(port, err => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${port}`);
});
