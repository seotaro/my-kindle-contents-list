const puppeteer = require('puppeteer');

module.exports = class AmazonScraper {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  initialize() {
    return puppeteer.launch()
      .then((browser) => {
        this.browser = browser;
        return browser.newPage();
      })
      .then((page) => {
        this.page = page;
      })
  }

  exit() {
    if (this.browser) {
      this.browser.close();
    }
  }

  // Amazon.co.jp から商品の価格を取得する。
  // 商品ページが存在しない商品は￥0で返す。
  getPrice(ASIN) {
    const url = `https://www.amazon.co.jp/dp/${ASIN}`;

    return this.page.goto(url)
      .then(() => {
        return this.page.$('#kindle-price')
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
  }
}