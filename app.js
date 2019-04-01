let puppeteer = require('puppeteer');

(async () => {
  let browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox']
  });

  let page = await browser.newPage();

  // //page변경
  await page.goto(
    'https://store.naver.com/restaurants/detail?id=19862383&query=%EC%84%B1%EC%88%98%EC%A1%B1%EB%B0%9C'
  );
  let imageUrl;

  /* Restaurant Image*/
  await page.waitForSelector('div.thumb_area');
  let imageList = await page.$$('div.thumb_area');
  console.log(imageList.length);
  let selectImage = imageList[3];
  imageUrl = await selectImage.$eval('img', function(el) {
    return el.src;
  });

  console.log(imageUrl);

  // await browser.close();
})();
