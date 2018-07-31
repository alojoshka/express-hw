
const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const pageUrl = 'https://alpha.mouzenidis-travel.ru/reactssr/hottourspage';
const pageUrl1 = 'https://alpha.mouzenidis-travel.ru/home/index3';


import urlModule from 'url';
const URL = urlModule.URL;

async function ssr(url) {
  ...
  const stylesheetContents = {};

  // 1. Stash the responses of local stylesheets.
  page.on('response', async resp => {
    const responseUrl = resp.url();
    const sameOrigin = new URL(responseUrl).origin === new URL(url).origin;
    const isStylesheet = resp.request().resourceType() === 'stylesheet';
    if (sameOrigin && isStylesheet) {
      stylesheetContents[responseUrl] = await resp.text();
    }
  });

  // 2. Load page as normal, waiting for network requests to be idle.
  await page.goto(url, {waitUntil: 'networkidle0'});

  // 3. Inline the CSS.
  // Replace stylesheets in the page with their equivalent <style>.
  await page.$$eval('link[rel="stylesheet"]', (links, content) => {
    links.forEach(link => {
      const cssText = content[link.href];
      if (cssText) {
        const style = document.createElement('style');
        style.textContent = cssText;
        link.replaceWith(style);
      }
    });
  }, stylesheetContents);

  // 4. Get updated serialized HTML of page.
  const html = await page.content();
  await browser.close();

  return {html};
}




app.get('/', function (req, res) {
    console.log("route index started");
   
     ssr(pageUrl1).then(html=>res.send(html)).catch(console.error);
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