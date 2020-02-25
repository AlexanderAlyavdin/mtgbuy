import express from 'express';
var request = require('request');

const app = express();
const port = 3030;

// Avoid CORS
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,x-compress');
    next();
});

app.get('/', (req, response) => {
  const cardName = req.query.cardName;
  request(`https://mtgsale.ru/home/search-results?Name=${cardName}`, (err, res, body) => {
      if (err) { return console.log(err); }
      response.send(body);
  });
});

app.listen(port, err => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${port}`);
});
