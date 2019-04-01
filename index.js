let puppeteer = require('puppeteer');

async function main() {
  let browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  });
  let page = await browser.newpage();
  for (let pageNum = 1; pageNum < 5; pageNum++) {
    await page.goto(
      `https://store.naver.com/restaurants/list?filterId=r08&page=${pageNum}&query=%EC%84%B1%EC%88%98%20%EB%A7%9B%EC%A7%91` //page변경
    );

    //find a link of restaurant
    await page.waitFor('li.list_item');
    let linkList = await page.$$('li.list_item');
    let urlList = [];
    console.log(linkList.length);
    for (let link of linkList) {
      let tag = await link.$eval('a.thumb_area', function(el) {
        return el.href;
      });
      urlList.push(tag);
    }

    for (let i = 0; i < urlList.length - 1; i++) {
      console.log('i: ', i, ' url: ', urlList[i]);
      await page.goto(urlList[i]);
      //해당 태그로 이동!
      await page.waitForSelector('div.biz_name_area'); //해당 element를 받아올 때까지 대기!
      let eh = await page.$('div.biz_name_area'); //$: single $$:list
      let title = await eh.$eval('strong.name', function(el) {
        return el.innerText;
      });
      let type = await eh.$eval('span.category', function(el) {
        return el.innerText;
      });

      console.log(`${title} ${type}`);

      await page.waitFor('div.list_menu_inner'); //해당 element를 받아올 때까지 대기!
      let menuList = await page.$$('div.list_menu_inner'); //$: single $$:list
      for (let i = 0; i < menuList.length - 1; i++) {
        let menuName = await menuList[i].$eval('span.name', function(el) {
          return el.innerText;
        });
        let menuPrice = await menuList[i].$eval('em.price', function(el) {
          return el.innerText;
        });
        console.log(`${menuName} ${menuPrice}`);
      }
    }
  }
  browser.close();
}
main();
