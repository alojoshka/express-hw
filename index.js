
const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const pageUrl = 'https://alpha.mouzenidis-travel.ru/reactssr/hottourspage';
const pageUrl1 = 'https://alpha.mouzenidis-travel.ru/home/index3';
//import urlModule from 'url';
const urlModule = require('url');

const URL = urlModule.URL;
let browserWSEndpoint = null;



async function ssr(url, browserWSEndpoint) {

  
  console.info('Connecting to existing Chrome instance.');
  const browser = await puppeteer.connect({browserWSEndpoint});

 // const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();

  // 1. Intercept network requests.
  await page.setRequestInterception(true);

  page.on('request', req => {
    // 2. Ignore requests for resources that don't produce DOM
    // (images, stylesheets, media).
    const whitelist = ['document', 'script', 'xhr', 'fetch'];
    if (!whitelist.includes(req.resourceType())) {
      return req.abort();
    }

    // 3. Pass through all other requests.
    req.continue();
  });

  await page.goto(url, {waitUntil: 'networkidle0'});
  const html = await page.content(); // serialized HTML of page DOM.
  await browser.close();

  return html;
}




app.get('/',async (req, res, next)=> {
  if (!browserWSEndpoint) {
    const browser = await puppeteer.launch();
    browserWSEndpoint = await browser.wsEndpoint();
  }
  try
  {
    const html = await ssr(pageUrl1, browserWSEndpoint);
    return res.status(200).send(html);
  }
  catch(e)
  {
    return res.send(e);
  }

    // ssr(pageUrl1,browserWSEndpoint).then(html=>res.send(html)).catch(console.error);
     //res.send('Hello World 113!');
  });
  const port = process.env.PORT || 8080;
  app.listen(port, function () {
    console.log('Example app listening on port ' + port);
  });




// var http = require('http');
// var server = http.createServer(function(req, res) {
//   res.writeHead(200, { 'Content-Type': 'text/plain' });
//   res.end('Hello world!');
// });
//server.listen(process.env.PORT | 3003);