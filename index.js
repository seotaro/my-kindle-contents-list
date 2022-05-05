'use strict';

require('dotenv').config();
const xml2js = require('xml2js');
const fs = require('fs').promises;
const { Parser } = require('json2csv');
const { getPrice } = require('./scraping');

const PATH = '/Users/seotaro/Library/Application Support/Kindle/Cache/KindleSyncMetadataCache.xml';

(async () => {
  const price = await getPrice('B089M77R61');

  const json = await fs.readFile(PATH)
    .then((xml) => {
      return xml2js.parseStringPromise(xml, { mergeAttrs: true, explicitArray: false });
    })

  let list = [];

  if (json.response?.add_update_list) {
    if (json.response.add_update_list.meta_data) {

      // json.response.add_update_list.meta_data.forEach(element => {
      for (const element of json.response.add_update_list.meta_data) {
        try {
          const price = await getPrice(element.ASIN);
          list.push({
            ASIN: element.ASIN
            , title: element.title._
            , purchaseDate: new Date(element.purchase_date)
            , price
          })
          console.log(element.ASIN, element.title._, price);

        } catch (err) {
          console.error(element.ASIN, err)
        }
      }
      // });
    }
  }

  console.log(list);

  const fields = ['ASIN', 'title', 'purchaseDate'];
  const opts = { fields };
  const parser = new Parser(opts);
  const csv = parser.parse(list);

  await fs.writeFile('output.csv', csv)
})();