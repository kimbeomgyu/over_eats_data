let puppeteer = require('puppeteer');

/* crawaling */
(async () => {
  let browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  });
  let urlList = [];
  let page = await browser.newPage();
  for (let i = 1; i < 6; i++) {
    await page.goto(
      `https://store.naver.com/restaurants/list?filterId=r08&page=${i}&query=%EC%A2%85%EB%A1%9C%EA%B5%AC%20%EB%A7%9B%EC%A7%91`,
      { timeout: 0 }
    );
    await page.waitFor('li.list_item');
    let restaurantList = await page.$$('li.list_item');
    for (let restaurant of restaurantList) {
      //take url from each restaurant list
      try {
        let url = await restaurant.$eval('a.thumb_area', function(el) {
          return el.href;
        });
        urlList.push(url);
      } catch {}
    }
  }

  await page.goto('about:blank');
  await page.close();

  /* Go to each page and crawl data */
  for (let i = 0; i < urlList.length - 1; i++) {
    let category;

    page = await browser.newPage();

    await page.goto(urlList[i], { timeout: 0 });

    /* Restaurant Name and Category */
    await page.waitForSelector('div.biz_name_area');
    let title = await page.$('div.biz_name_area');

    category = await title.$eval('span.category', function(el) {
      return el.innerText;
    });

    console.log(category);
    await page.goto('about:blank');
    await page.close();
  }

  console.log('end');
  await browser.close();
})();
