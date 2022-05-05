'use strict';

const xml2js = require('xml2js');
const fs = require('fs').promises;
const { Parser } = require('json2csv');
// const { Parser, transforms: { unwind } } = require('json2csv');

const PATH = '/Users/seotaro/Library/Application Support/Kindle/Cache/KindleSyncMetadataCache.xml';

(async () => {
  const list = await fs.readFile(PATH)
    .then((xml) => {
      return xml2js.parseStringPromise(xml, { mergeAttrs: true, explicitArray: false });
    })
    .then((json) => {
      let list = [];

      if (json.response?.add_update_list) {
        if (json.response.add_update_list.meta_data) {
          json.response.add_update_list.meta_data.forEach(element => {
            list.push({
              ASIN: element.ASIN
              , title: element.title._
              , purchaseDate: new Date(element.purchase_date)
            })
          });
        }
      }

      return list;
    })

  console.log(list);

  const fields = ['ASIN', 'title', 'purchaseDate'];
  const opts = { fields };
  const parser = new Parser(opts);
  const csv = parser.parse(list);

  await fs.writeFile('output.csv', csv)
})();