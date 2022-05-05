const puppeteer = require('puppeteer');

exports.getPrice = async (ASIN) => {
  const url = `https://www.amazon.co.jp/dp/${ASIN}`;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url);

  const element = await page.$('#kindle-price');
  let price = (await (await element.getProperty('textContent')).jsonValue()).replaceAll(/[ ,￥]/g, '');
  await browser.close();

  return Number(price);
}

