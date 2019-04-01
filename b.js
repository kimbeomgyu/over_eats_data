let puppeteer = require('puppeteer');
let mongoose = require('mongoose');
mongoose.connect('mongodb://13.125.252.142:38380/overEats', {
  useNewUrlParser: true
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log('we are connected!');

  /* crawaling */
  (async () => {
    let browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox']
    });

    let page = await browser.newPage();
    await page.goto(
      `https://store.naver.com/restaurants/list?filterId=r08&page=1&query=%EC%A2%85%EB%A1%9C%EA%B5%AC%20%EB%A7%9B%EC%A7%91`,
      { timeout: 0 }
    );

    //   await page.goto('about:blank');
    //   await page.close();

    console.log('end');
    // await browser.close();
  })();
});
