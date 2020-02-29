// const puppeteer = require("puppeteer");

// (async () => {

//   // Extract partners on the page, recursively check the next page in the URL pattern
//   const extractPartners = async url => {

//     // Scrape the data we want
//     const page = await browser.newPage();
//     await page.goto(url);
//     const partnersOnPage = await page.evaluate(() =>
//       Array.from(document.querySelectorAll("tbody")).map(compact => ({
//         partNum: compact.querySelector("span.table-desc-text").innerText.trim(),
//         nsn: compact.querySelector("tr td.hidden-xs a.part-no-link").innerText.trim(),
//         itemName: compact.querySelector("span.table-desc-text.capitalize").innerText.trim()
//       }))
//     );
//     await page.close();

//     // Recursively scrape the next page
//     if (partnersOnPage.length < 1) {
//       // Terminate if no partners exist
//       return partnersOnPage
//     } else {
//       // Go fetch the next page ?page=X+1
//       const nextPageNumber = parseInt(url.match(/page-(.*)$/)) + 1;

//       const nextUrl = `https://www.nsnunlimited.com/nsn/manufacturer/bell-helicopter-textron-inc/page-${nextPageNumber+1}/`;

//       return partnersOnPage.concat(await extractPartners(nextUrl))
//     }
//   };

//   const browser = await puppeteer.launch({ headless: false });
//   const firstUrl =
//     "https://www.nsnunlimited.com/nsn/manufacturer/bell-helicopter-textron-inc/page-2/";
//   const partners = await extractPartners(firstUrl);

//   // Todo: Update database with partners
//   console.log(partners);

//   await browser.close();
// })();



// const puppeteer = require('puppeteer');

// (async function main() {
//   try {

//     console.log("in");
//     const browser = await puppeteer.launch({ headless: false });
//     const page = await browser.newPage();
//     page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; rv:68.0) Gecko/20100101 Firefox/68.0');

//     await page.goto('https://www.nsnunlimited.com/nsn/manufacturer/bell-helicopter-textron-inc/');
//     // await page.waitForSelector('ol.c');

//     // console.log("its showing");

//     // const search = await page.$$('ol.c');
//     // console.log(search.length);

//     // for (const li of search) {
//     //   const button = await li.$('div.listing-info div.info.l h2');
//     //   // button.click();
//     //   console.log(button);
//     // }


//     console.log('before waiting');
//     await page.waitFor(4000);
//     console.log('after waiting');

//     await page.waitForSelector('tbody');

//     const partnersOnPage = await page.evaluate(() =>
//       Array.from(document.querySelectorAll("tbody tr")).map(td => ({
//         partnum: td.querySelector("html body section.white_content div.container-fluid div.container div.row div.col-lg-9.rhs div.content_section.content_section2 div.part_list table.table.table-bordered tbody tr td a.part-no-link span").innerText.trim(),
//         nsn: td.querySelector("html body section.white_content div.container-fluid div.container div.row div.col-lg-9.rhs div.content_section.content_section2 div.part_list table.table.table-bordered tbody tr td.hidden-xs").innerText.trim(),
//         item: td.querySelector("html body section.white_content div.container-fluid div.container div.row div.col-lg-9.rhs div.content_section.content_section2 div.part_list table.table.table-bordered tbody tr td.hidden-xs span.table-desc-text.capitalize").innerText.trim()
//       }))
//     );

//     console.log(partnersOnPage);

//     //   const click = await page.$(`a[title~="${i}"]`);

//     //   await click.evaluate(click => {
//     //     click.click();
//     //   });
//     // }


//   } catch (e) {

//     console.log("my error", e);
//   }
// })();

//////////////////////////////////////////////////////

const puppeteer = require('puppeteer');
let fs = require('fs');

let scrape = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; rv:68.0) Gecko/20100101 Firefox/68.0');
  await page.goto('https://calscape.org/loc-Riverside,CA/cat-All-Plants/ord-popular/page-1/np-0?&srchcr=sc5e5aacc0658fd');

  var results = []; // variable to hold collection of all book titles and prices
  var lastPageNumber = 4; // this is hardcoded last catalogue page, you can set it dunamically if you wish
  // defined simple loop to iterate over number of catalogue pages
  for (let index = 0; index < lastPageNumber; index++) {
    // wait 1 sec for page load
    await page.waitFor(5000);
    // call and wait extractedEvaluateCall and concatenate results every iteration.
    // You can use results.push, but will get collection of collections at the end of iteration
    results = results.concat(await extractedEvaluateCall(page));
    // this is where next button on page clicked to jump to another page
    if (index != lastPageNumber - 1) {
      // no next button on last page
      await page.click('html body section.white_content div.container-fluid div.container div.row div.col-lg-9.rhs div.content_section.content_section2 div.row div.col-lg-6 div.pagination_top.main_paging.default ul.pagination.removespace li.right-etc a.test');
    }
  }
  let obj = {
    infoToJack: []
  };
  obj.infoToJack.push(results);
  let json = JSON.stringify(obj);
  fs.writeFileSync('infojack.json', json, 'utf8');
  browser.close();
  return results;
};

async function extractedEvaluateCall(page) {
  // just extracted same exact logic in separate function
  // this function should use async keyword in order to work and take page as argument
  return page.evaluate(() => {
    let data = [];
    let elements = document.querySelectorAll('.pad');

    for (var element of elements) {

      let info = element.querySelector(`.common_name`).innerText.trim()

      data.push(
        {
         info
        });
    }

    return data;
  });
}

scrape().then((value) => {
  console.log(value);
  console.log('Collection length: ' + value.length);
  console.log(value[0]);
  console.log(value[value.length - 1]);
});
/////////////////////////////////////////
