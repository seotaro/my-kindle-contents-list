'use strict';

const xml2js = require('xml2js');
const fs = require('fs').promises;

const PATH = '/Users/seotaro/Library/Application Support/Kindle/Cache/KindleSyncMetadataCache.xml';

(async () => {
  fs.readFile(PATH)
    .then((xml) => {
      return xml2js.parseStringPromise(xml, { mergeAttrs: true, explicitArray: false });
    })
    .then((json) => {
      if (json.response?.add_update_list) {
        if (json.response.add_update_list.meta_data) {
          json.response.add_update_list.meta_data.forEach(element => {
            console.log(element.ASIN
              , element.title._
              // , element.publishers.publisher ? element.publishers.publisher : ''
              // , element.authors.author._
              , new Date(element.purchase_date));
          });
        }
      }
    })
})();