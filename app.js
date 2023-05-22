const puppeteer = require('puppeteer')
const productToSearch = process.argv.slice(2)[0]
const productScrapping = require('./functions/product-scrapping')
const formattedDate = require('./functions/date')
const productQuery = require('./functions/query')
const { insertDB, searchDB } = require('./db')

function run(pagesToScrape) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!pagesToScrape) {
        pagesToScrape = 1
      }

      const browser = await puppeteer.launch({
        headless: true,
        slowMo: 150,
        devtools: true,
        args: ['--window-size=1920,1080'],
        defaultViewport: null,
      })
      const page = await browser.newPage()
      await page.goto('https://www.mercadolibre.com.pe/')
      await page.type('.nav-search-input', productToSearch)
      await page.click('.nav-icon-search')
      await page.waitForSelector('.ui-search-result__content-wrapper')
      let currentPage = 1
      let results = []
      while (currentPage <= pagesToScrape) {
        let output = await page.evaluate(() => {
          let urls = []
          const productContainers = [
            ...document.querySelectorAll('.ui-search-result__wrapper'),
          ]
          productContainers.map((container) => {
            const url = container
              .querySelector('a.ui-search-link')
              .getAttribute('href')
            urls.push(url)
          })
          return urls
        })
        results = [...results, ...output]
        if (currentPage < pagesToScrape) {
          try {
            await page.waitForSelector('li.andes-pagination__button'),
              await page.click('li.andes-pagination__button--next')
          } catch (err) {
            console.error(err)
          }
        }
        currentPage++
      }
      browser.close()
      return resolve(results)
    } catch (err) {
      return reject(err)
    }
  })
}

run(2)
  .then((data) => {
    const items = data.length
    console.log(`${items} products are being processed`)
    return productScrapping(data)
  })
  .then((data) => productQuery(data))
  .then((query) => {
    insertDB(query[0])
    console.log(`Database updated with ${query[1]} new registers`)
  })
  .then(() => {
    searchDB('watch 41 mm', 1199, 1999)
  })
  .catch(console.error)
