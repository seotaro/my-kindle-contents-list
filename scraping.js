const puppeteer = require('puppeteer');

// Amazon.co.jp から商品の価格を取得する。
// 商品ページが存在しない商品は￥0で返す。
exports.getPrice = async (ASIN) => {
  const url = `https://www.amazon.co.jp/dp/${ASIN}`;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  return page.goto(url)
    .then(() => {
      return page.$('#kindle-price')
    })
    .then((element) => {
      return element ? element.getProperty('textContent') : null;
    })
    .then((property) => {
      return property ? property.jsonValue() : null;
    })
    .then((value) => {
      return value ? Number(value.replaceAll(/[ ,￥]/g, '')) : 0;
    })
    .finally(() => {
      browser.close();
    })
}

