let puppeteer = require('puppeteer');
let mongoose = require('mongoose');
mongoose.connect('mongodb://over:eats@13.125.190.232:27017/overEats', {
  useNewUrlParser: true
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log('we are connected!');
});

/* schema */
var reviewSchema = new mongoose.Schema({
  name: String,
  rating: Number,
  content: String,
  Date: { type: Date, default: Date.now }
});

var menuSchema = new mongoose.Schema({
  name: String,
  price: String
});
var restaurantSchema = new mongoose.Schema({
  name: String,
  address: String,
  category: String,
  rating: { type: Number, default: 3.5 },
  menus: [menuSchema],
  reviews: [reviewSchema],
  numberOfOrder: { type: Number, default: 50 },
  thumbImg: String
});

//compile our schema into a model
var restaurant = mongoose.model('restaurant', restaurantSchema);
/* classification category */
let korean = [
  '백반',
  '가정식',
  '기사식당',
  '찜닭',
  '돼지고기구이',
  '육류',
  '고기요리',
  '막국수',
  '쌈밥',
  '소고기구이',
  '닭요리',
  '샤브샤브',
  '칼국수',
  '만두',
  '닭볶음탕',
  '감자탕',
  '백숙',
  '삼계탕',
  '한식',
  '국밥',
  '주꾸미요리',
  '한정식',
  '장어',
  '조개요리',
  '먹장어',
  '요리',
  '낙지요리',
  '한식뷔페',
  '전',
  '빈대떡',
  '냉면',
  '오징어요리'
];
let snack = ['종합분식', '떡볶이', '김밥', '분식', '국수'];
let japan = [
  '돈가스',
  '우동',
  '소바',
  '전복요리',
  '생선회',
  '일식당',
  '초밥뷔페',
  '일본식라면',
  '초밥',
  '롤',
  '일식',
  '덮밥'
];
let chicken = ['치킨', '닭강정'];
let pizza = ['피자'];
let chinese = ['중식당'];
let pork = ['족발', '보쌈', '막국수'];
let night = [
  '곱창',
  '막창',
  '양',
  '닭발',
  '해물',
  '생선요리',
  '와인',
  '이자카야',
  '포장마차',
  '요리주점',
  '닭갈비',
  '술집'
];
let soup = [
  '감자탕',
  '매운탕',
  '해물탕',
  '찌개',
  '전골',
  '해장국',
  '찌개',
  '전골',
  '순대',
  '순대국',
  '아귀찜',
  '해물찜',
  '곰탕',
  '설렁탕',
  '갈비탕'
];
let lunchBox = ['도시락', '죽', '컵밥'];
let dessert = [
  '케이크전문',
  '와플',
  '빙수',
  '차',
  '카페',
  '디저트',
  '크레페',
  '베이글',
  '베이커리',
  '케이크 전문',
  '브런치',
  '테이크아웃커피',
  '홍차전문점'
];
let junk = [
  '양식',
  '이탈리아음식',
  '햄버거',
  '샌드위치',
  '스파게티',
  '파스타 전문'
];
let world = [
  '킹크랩요리',
  '맥주',
  '호프',
  '아시아음식',
  '프랑스음식',
  '카레',
  '바(BAR)',
  '뷔페',
  '베트남음식',
  '오리요리',
  '퓨전음식',
  '멕시코',
  '남미음식',
  '바닷가재요리',
  '패밀리 레스토랑',
  '스테이크',
  '립',
  '스페인 음식',
  '해산물 뷔페',
  '딤섬',
  '중식만두',
  '인도음식',
  '그리스',
  '터키음식',
  '전통',
  '민속주점',
  '스페인음식',
  '양꼬치',
  '태국음식',
  '두부요리',
  '게요리'
];
let area = [
  //'종로구',
  //'중구',
  //'용산구',
  //'성동구',
  //'광진구',
  //'동대문구',
  //'중랑구',
  //'성북구',
  //'강북구',
  //'도봉구',
  //'노원구',
  //'은평구',
  //'서대문구',
  //'마포구',
  //'양천구',
  '강서구',
  '구로구',
  '금천구',
  '영등포구',
  '동작구',
  '관악구',
  '서초구',
  '강남구',
  '송파구',
  '강동구'
];
/* crawaling */
async function urlScrap(area) {
  let browser = await puppeteer.launch({
    // headless: false
    // args: ['--no-sandbox']
  });
  let page = await browser.newPage();
  let urlList = [];

  let areaUrlNum = [];

  let num = 0;
  console.log('area: ', area);
  for (let j = 1; j <= 50; j++) {
    console.log(j);
    try {
      await page.goto(
        `https://store.naver.com/restaurants/list?filterId=r08&page=${j}&query=${area}%20%EB%A7%9B%EC%A7%91`
      );
      try {
        await page.waitFor('li.list_item');
      } catch(err) {
	if(err)console.log(err)
        await page.goto(
          `https://store.naver.com/restaurants/list?filterId=r08&page=${j}&query=${area}%20%EB%A7%9B%EC%A7%91`
        );
      }
      let restaurantList = await page.$$('li.list_item');
      for (let restaurant of restaurantList) {
        //take url from each restaurant list
        await page.waitFor(1000);

        try {
          let url = await restaurant.$eval('a', function(el) {
            return el.href;
          });
          await restaurantScrap(url, area);
          // urlList.push(url);
        } catch (err) {
          if (err) console.log(err);
        }
      }
    } catch (err) {
      if (err) console.log(err);
    }
  }
  await page.close();
  console.log('매무리');
  await browser.close();
}

(async function() {
  for (const value of area) {
    await urlScrap(value);
  }
})();

const restaurantScrap = async (url, address) => {
  let browser = await puppeteer.launch({
    // headless: false
  });

  // let urlNum = 0;
  // let n = 0;
  /* Go to each page and crawl data */
  // for (let i = 0; i < urlList.length - 1; i++) {
  console.log('레스토랑스크랩 시작', address);
  let category, restaurantName, imageUrl;
  let menu = [];
  //go to each page
  let page = await browser.newPage();
  try {
    await page.goto(url);
  } catch (err) {
    if (err) console.log(err);
  }

  /* Restaurant Image*/
  try {
    await page.waitForSelector('div.thumb_area', { timeout: 5000 });
    let imageList = await page.$$('div.thumb_area');

    let selectImage = imageList[3];
    if (selectImage) {
      imageUrl = await selectImage.$eval('img', function(el) {
        return el.src;
      });
    }
  } catch (err) {
    if (err) console.log(err);
  }
  /* Restaurant Name and Category */
  try {
    await page.waitForSelector('div.biz_name_area');
    let title = await page.$('div.biz_name_area');
    restaurantName = await title.$eval('strong.name', function(el) {
      return el.innerText;
    });
    category = await title.$eval('span.category', function(el) {
      return el.innerText;
    });
  } catch (err) {
    if (err) console.log(err);
  }

  if (korean.includes(category)) category = '한식';
  else if (snack.includes(category)) category = '분식';
  else if (japan.includes(category)) category = '돈까스,회,일식';
  else if (chicken.includes(category)) category = '치킨';
  else if (pizza.includes(category)) category = '피자';
  else if (chinese.includes(category)) category = '중국집';
  else if (pork.includes(category)) category = '족발,보쌈';
  else if (night.includes(category)) category = '야식';
  else if (soup.includes(category)) category = '찜,탕';
  else if (lunchBox.includes(category)) category = '도시락';
  else if (dessert.includes(category)) category = '카페,디저트';
  else if (junk.includes(category)) category = '패스트푸드';
  else if (world.includes(category)) category = '세계음식';
  else {
    await page.goto('about:blank');
    await page.close();
    await browser.close();
    return;
  }

  /* Restaurant Menu and Price */
  try {
    await page.waitForSelector('div.list_menu_inner');
    let menuList = await page.$$('div.list_menu_inner');
    for (let j = 0; j < menuList.length - 1; j++) {
      let menuobj = {};
      let menuName = await menuList[j].$eval('span.name', function(el) {
        return el.innerText;
      });
      let menuPrice = await menuList[j].$eval('em.price', function(el) {
        return el.innerText;
      });

      (menuobj['name'] = menuName), (menuobj['price'] = menuPrice);
      menu.push(menuobj);
    }
  } catch (err) {
    if (err) console.log(err);
  }
  // urlNum++;

  /* Save to the database */
  restaurant.find({ name: restaurantName }, (err, data) => {
    if (err) console.log(err);
    if (data.length === 0) {
      restaurant.create({
        name: restaurantName,
        address,
        category: category,
        menus: menu,
        thumbImg: imageUrl
      });
    }
    console.log('들어감!', restaurantName);
  });

  //처리한 url 개수
  // if (urlNum === areaUrlNum[n]) {
  //   if (n < area.length) {
  //     add = area[n + 1];
  //     n++;
  //     urlNum = 0;
  //   }
  // }
  // console.log('push!');

  await page.close();
  await browser.close();
  return;
};
// };
