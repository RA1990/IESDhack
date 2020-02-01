const puppeteer = require('puppeteer');

(async function main() {
  try {

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; rv:68.0) Gecko/20100101 Firefox/68.0');

    await page.goto('https://www.yellowbook.com/s/auto-repair/little-rock-ar/');
    await page.waitForSelector('ol.c');

    console.log("its showing");

    const search = await page.$$('ol.c');
    console.log(search.length);

    for (const li of search) {
      const button = await li.$('div.listing-info div.info.l h2');
      // button.click();
      console.log(button);
    }

  } catch (e) {

    console.log("my error", e);
  }
})();
