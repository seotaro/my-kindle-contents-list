const puppeteer = require('puppeteer');

// Amazon.co.jp から商品の価格を取得する。
exports.getPrice = async (ASIN) => {
  const url = `https://www.amazon.co.jp/dp/${ASIN}`;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  return page.goto(url)
    .then(() => {
      return page.$('#kindle-price')
    })
    .then((element) => {
      return element.getProperty('textContent');
    })
    .then((property) => {
      return property.jsonValue();
    })
    .then((value) => {
      return Number(value.replaceAll(/[ ,￥]/g, ''));
    })
    .finally(() => {
      browser.close();
    })
}

