const puppeteer = require('puppeteer');

async function scrapeProduct(url) {
  const browser = await puppeteer.launch(); // this is to start up browser
  const page = await browser.newPage(); // this is going to give us a blank page
  await page.goto(url);// this directs which page to open

  const [el] = await page.$x('//*[@id="imgBlkFront"]'); // this where the x path goes
  const src = await el.getProperty('src'); // this targets the property of the html element
  const imgURL = await src.jsonValue(); // this pulls out the string value

  const [el2] = await page.$x('//*[@id="productTitle"]/text()');
  const txt = await el2.getProperty('textContent');
  const title = await txt.jsonValue();

  const [el3] = await page.$x('//*[@id="buyNewSection"]/a/h5/div/div[2]/div/span[2]');
  const txt2 = await el3.getProperty('textContent');
  const price = await txt2.jsonValue();



  console.log({ imgURL, title, price }); // then to check if it worked


  browser.close(); // this to stop after everthing has been done or else it wont stop
}


scrapeProduct("");// input url where you want to vist





// command to run this from terminal is // node scrapers.js //
