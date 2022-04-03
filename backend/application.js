/* --------------------------------------------------
CONSTANTS
-----------------------------------------------------*/
const FINNHUB_ENDPOINT = 'https://finnhub.io/';
const API_KEY = "c84k32aad3i9u79h9pj0";

/* --------------------------------------------------
EXPRESS START
-----------------------------------------------------*/

const url = require('url');
var cors = require('cors');
const express = require('express')
const app = express()
app.use(cors());
const port = 8050

app.get('/', (req, res) => {
  res.send('Hello: type /stock_profile?stockName=');
})

app.get('/stock_profile', (req, res) => {
  const queryObject = url.parse(req.url, true).query;
  // console.log(queryObject['stockName']);
  var result = stockProfile(queryObject['stockName']); // verify stock name is empty or not
  result.then(function (response) {
    res.send(response.data);
}).catch(err => console.log(err));
})

app.get('/stock_quote', (req, res) => {
  const queryObject = url.parse(req.url, true).query;
  // console.log(queryObject['stockName']);
  var result = stockQuote(queryObject['stockName']); // verify stock name is empty or not
  result.then(function (response) {
    res.send(response.data);
}).catch(err => console.log(err));
})

app.get('/stock_autocomplete', (req, res) => {
  const queryObject = url.parse(req.url, true).query;
  // console.log(queryObject['stockName']);
  var result = stockAutoComplete(queryObject['stockName']); // verify stock name is empty or not
  result.then(function (response) {
    res.send(response.data);
}).catch(err => console.log(err));
})

app.get('/stock_recommendations', (req, res) => {
  const queryObject = url.parse(req.url, true).query;
  // console.log(queryObject['stockName']);
  var result = stockRecommendations(queryObject['stockName']); // verify stock name is empty or not
  result.then(function (response) {
    res.send(response.data);
}).catch(err => console.log(err));
})

app.get('/stock_peers', (req, res) => {
  const queryObject = url.parse(req.url, true).query;
  // console.log(queryObject['stockName']);
  var result = stockPeers(queryObject['stockName']); // verify stock name is empty or not
  result.then(function (response) {
    res.send(response.data);
}).catch(err => console.log(err));
})

app.get('/stock_earnings', (req, res) => {
  const queryObject = url.parse(req.url, true).query;
  // console.log(queryObject['stockName']);
  var result = stockEarnings(queryObject['stockName']); // verify stock name is empty or not
  result.then(function (response) {
    res.send(response.data);
}).catch(err => console.log(err));
})

// from should be in milliseconds and epoch time
app.get('/stock_candle', (req, res) => {
  const queryObject = url.parse(req.url, true).query;
  // console.log(queryObject['stockName']);
  // console.log(queryObject['from']);
  var result = stockCandle(queryObject['stockName'], queryObject['resolution'], queryObject['from'], queryObject['to']); // verify stock name is empty or not
  result.then(function (response) {
    res.send(response.data);
}).catch(err => console.log(err));
})

app.get('/stock_news', (req, res) => {
  const queryObject = url.parse(req.url, true).query;
  // console.log(queryObject['stockName']);
  var result = stockNews(queryObject['stockName']); // verify stock name is empty or not
  result.then(function (response) {
    res.send(response.data);
}).catch(err => console.log(err));
})

app.get('/stock_sentiment', (req, res) => {
  const queryObject = url.parse(req.url, true).query;
  // console.log(queryObject['stockName']);
  var result = stockSentiment(queryObject['stockName']); // verify stock name is empty or not
  result.then(function (response) {
    res.send(response.data);
}).catch(err => console.log(err));
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

/* --------------------------------------------------
STOCK APIS
-----------------------------------------------------*/

// 4.1.1 Company’s Description
async function stockProfile(stockName) {
    const axios = require('axios');
    var urlName = FINNHUB_ENDPOINT + 'api/v1/stock/profile2?' + 'symbol=' + stockName + '&token=' + API_KEY;
    const response = await axios.get(urlName);
    return response;
    
}

// 4.1.2 Company’s Historical Data
// FROM TIME should be in seconds
async function stockCandle(stockName, resolution, fromTime, toTime) {
  const axios = require('axios');
  // console.log('from time');
  // console.log(fromTime);
  // var toTime = Math.floor(new Date().valueOf() / 1000);
  var urlName = FINNHUB_ENDPOINT + 'api/v1/stock/candle?' + 'symbol=' + stockName + '&resolution=' + resolution + '&from=' + fromTime + '&to=' + toTime + '&token=' + API_KEY;
  const response = await axios.get(urlName);
  return response;
  
}

// 4.1.3 Company’s Latest Price of Stock
async function stockQuote(stockName) {
  const axios = require('axios');
  var urlName = FINNHUB_ENDPOINT + 'api/v1/quote?' + 'symbol=' + stockName + '&token=' + API_KEY;
  const response = await axios.get(urlName);
  return response;
  
}

// 4.1.4 Autocomplete
async function stockAutoComplete(stockName) {
  const axios = require('axios');
  var urlName = FINNHUB_ENDPOINT + 'api/v1/search?' + 'q=' + stockName + '&token=' + API_KEY;
  const response = await axios.get(urlName);
  return response;
}

// 4.1.5 Company’s News
async function stockNews(stockName) {
  const axios = require('axios');
  var toDate = new Date(); 
  var dateOffset = (24*60*60*1000) * 7; //7 days
  var fromDate = new Date();
  fromDate.setTime(fromDate.getTime() - dateOffset);
  // console.log(toDate);
  // console.log(fromDate);
  var toDateStr = toDate.toISOString().split("T")[0];
  var fromDateStr = fromDate.toISOString().split("T")[0];
  // console.log(toDateStr);
  // console.log(fromDateStr);
  var urlName = FINNHUB_ENDPOINT + 'api/v1/company-news?' + 'symbol=' + stockName + '&from=' + fromDateStr + '&to=' + toDateStr  + '&token=' + API_KEY;
  const response = await axios.get(urlName);
  return response;
}

// 4.1.6 Company’s Recommendation Trends
async function stockRecommendations(stockName) {
  const axios = require('axios');
  var urlName = FINNHUB_ENDPOINT + 'api/v1/stock/recommendation?' + 'symbol=' + stockName + '&token=' + API_KEY;
  const response = await axios.get(urlName);
  return response;
}

// 4.1.7 Company’s Social Sentiment
async function stockSentiment(stockName) {
  const axios = require('axios');
  var fromDate = "2022-01-01";
  var urlName = FINNHUB_ENDPOINT + 'api/v1/stock/social-sentiment?' + 'symbol=' + stockName + '&from=' + fromDate + '&token=' + API_KEY;
  const response = await axios.get(urlName);
  return response;
}

// 4.1.8 Company’s Peers

async function stockPeers(stockName) {
  const axios = require('axios');
  var urlName = FINNHUB_ENDPOINT + 'api/v1/stock/peers?' + 'symbol=' + stockName + '&token=' + API_KEY;
  const response = await axios.get(urlName);
  return response;
}

// 4.1.9 Company’s Earnings

async function stockEarnings(stockName) {
  const axios = require('axios');
  var urlName = FINNHUB_ENDPOINT + '/api/v1/stock/earnings?' + 'symbol=' + stockName + '&token=' + API_KEY;
  const response = await axios.get(urlName);
  return response;
}