const puppeteerExtra = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
const randomUseragent = require('random-useragent');

puppeteerExtra.use(pluginStealth());

module.exports = class PuppeteerService {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  initialize() {
    return puppeteerExtra.launch({ headless: false, defaultViewport: null })
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
  getAmazonPrice(ASIN) {
    const url = `https://www.amazon.co.jp/dp/${ASIN}`;

    const userAgent = randomUseragent.getRandom()

    return this.page.setUserAgent(userAgent)
      .then(() => {
        return this.page.setDefaultNavigationTimeout(0);
      })
      .then(() => {
        return this.page.goto(url, { waitUntil: 'networkidle2', })
      })
      .then(() => {
        return this.page.$('#kindle-price')
      })
      .then((element) => {
        if (!element) {
          throw new Error('#kindle-price does not exist');
        }

        return element.getProperty('textContent');
      })
      .then((property) => {
        return property.jsonValue();
      })
      .then((value) => {
        return Number(value.replaceAll(/[ ,￥]/g, ''));
      })
  }
}