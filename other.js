

const puppeteer = require('puppeteer');

async function ssr3(url) {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();

  // 1. Intercept network requests.
  await page.setRequestInterception(true);

 
  page.on('response', async resp => {
     console.log("response " );
    const responseUrl = resp.url();
    console.log("response url " + responseUrl);
    const sameOrigin = new URL(responseUrl).origin === new URL(url).origin;
    const isStylesheet = resp.request().resourceType() === 'stylesheet';
    console.log("is stylesheet" + isStylesheet);
    if (sameOrigin && isStylesheet) {
      stylesheetContents[responseUrl] = await resp.text();
      console.log("stylesheet " +stylesheetContents[responseUrl]);
    }
   
  });
  await page.goto(url, {waitUntil: 'networkidle0'});

  
  // 3. Inline the CSS.
  //Replace stylesheets in the page with their equivalent <style>.
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
  const html = await page.content(); // serialized HTML of page DOM.
  await browser.close();

  return html;
}

async function ssr2(url) {
    const browser = await puppeteer.launch({headless: true});
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



async function ssr11(url) {
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
