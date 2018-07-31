
const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const pageUrl = 'https://alpha.mouzenidis-travel.ru/reactssr/hottourspage';
const pageUrl1 = 'https://alpha.mouzenidis-travel.ru/home/index3';

async function ssr(url) {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  await page.goto(url, {waitUntil: 'networkidle0'});
  const html = await page.content(); // serialized HTML of page DOM.
  await browser.close();
  return html;
}


const rend=async () => {
  console.log("async function called");
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage()
  //await page.setViewport({ width: 1280, height: 800 })



  await page.goto(pageUrl1, {waitUntil: 'networkidle0'})
  const name = await page.content();//await page.evaluate(() => page.content())
 // console.log(name);
  
  // const name = await page.evaluate(() => document.querySelector('.hot-tours-react').innerText)
  // console.log(name)

  // const stories = await page.evaluate(() => {
  //   const anchors = Array.from(document.querySelectorAll('a'))
  //   return anchors.map(anchor => anchor.textContent).slice(0, 10)
  // })
  // console.log(stories)
  // const title = await page.title()
  // console.log(title + " title")
  await browser.close()
  return name;
};


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