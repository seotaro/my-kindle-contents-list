'use strict';

const xml2js = require('xml2js');
const fs = require('fs').promises;
const { Parser } = require('json2csv');
const path = require('path');
const PuppeteerService = require('./puppeteerService');

// 引数チェック
if (process.argv.length !== 3) {
  const basename = path.basename(process.argv[1]);

  console.error(`Usage: node ${basename} KindleSyncMetadataCache.xml`);
  process.exit(1);
}

const PATH = process.argv[2];

(async () => {
  const json = await fs.readFile(PATH)
    .then((xml) => {
      return xml2js.parseStringPromise(xml, { mergeAttrs: true, explicitArray: false });
    })

  if (!json.response?.add_update_list) {
    return
  }
  if (!json.response.add_update_list.meta_data) {
    return
  }

  const puppeteer = new PuppeteerService();
  await puppeteer.initialize();

  // 順番に取得していく。
  const result = [];
  for (const meta_data of json.response.add_update_list.meta_data) {
    let retryCount = 3;
    while (0 < retryCount) {
      try {
        const price = await puppeteer.getAmazonPrice(meta_data.ASIN)
        result.push({
          ASIN: meta_data.ASIN
          , title: meta_data.title._
          , purchaseDate: new Date(meta_data.purchase_date)
          , price
        });

        retryCount = 0;
        console.log(meta_data.ASIN, price)

      } catch (err) {
        retryCount--;
        console.error(meta_data.ASIN, err);
      }
    }
  }

  await puppeteer.exit();

  const fields = ['ASIN', 'title', 'purchaseDate', 'price'];
  const opts = { fields };
  const parser = new Parser(opts);
  const csv = parser.parse(result);
  await fs.writeFile('output.csv', csv);
})();