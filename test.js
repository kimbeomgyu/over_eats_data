let puppeteer = require('puppeteer');

(async () => {
  let browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  });
  let urlList = [];
  let page = await browser.newPage();
  //   for (let i = 1; i < 4; i++) {
  //     await page.goto(
  //       `https://store.naver.com/restaurants/list?filterId=r08&page=${i}&query=%EC%84%B1%EC%88%98%20%EB%A7%9B%EC%A7%91`
  //     );
  //     await page.waitFor('li.list_item');

  //     //   await page.waitFor('li.list_item');
  //     let restaurantList = await page.$$('li.list_item');
  //     for (let restaurant of restaurantList) {
  //       //take url from each restaurant list
  //       try {
  //         let url = await restaurant.$eval('a.thumb_area', function(el) {
  //           return el.href;
  //         });
  //         urlList.push(url);
  //       } catch {}
  //     }
  //     console.log(urlList.length);
  //   }

  await page.goto(
    `https://store.naver.com/restaurants/list?filterId=r08&page=1&query=%EC%84%B1%EC%88%98%20%EB%A7%9B%EC%A7%91`
  );
  await page.waitForSelector('li.list_item');
  let restaurantList = await page.$$('li.list_item');

  for (let restaurant of restaurantList) {
    //take url from each restaurant list
    // try {
    await restaurant.$eval('a.thumb_area', function(el) {
      urlList.push(el.href);
    });
    // } catch {}
  }
  //page변경
  for (let i = 0; i < urlList.length - 1; i++) {
    //go to url
    await page.goto(urlList[i]);

    /* Restaurant Name and Category */
    await page.waitForSelector('div.biz_name_area');
    let title = await page.$('div.biz_name_area');
    let restaurantName = await title.$eval('strong.name', function(el) {
      return el.innerText;
    });
    let category = await title.$eval('span.category', function(el) {
      return el.innerText;
    });
    console.log(restaurantName, ' ', category);

    /* Restaurant Menu and Price */
    // await page.waitForSelector('div.list_menu_inner');
    // let menuList = await page.$$('div.list_menu_inner');
    // for (let j = 0; j < menuList.length - 1; j++) {
    //   let menuName = await menuList[j].$eval('span.name', function(el) {
    //     return el.innerText;
    //   });
    //   let menuPrice = await menuList[j].$eval('em.price', function(el) {
    //     return el.innerText;
    //   });
    //   console.log(`${menuName} ${menuPrice}`);
    // }
    console.log('===============================');
  }

  console.log('listening..');
  await browser.close();
})();

//     await page.goto(p);
//     await page.goto('about:blank');
//     await page.close();
