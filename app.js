const puppeteer = require('puppeteer')
const productToSearch = process.argv.slice(2)[0]
const date = require('./functions/date')
const { searchDB, insertDB } = require('./db')
const products = require('./product')

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
        let output = await page.evaluate((date) => {
          let productInfo = []
          const productContainers = [
            ...document.querySelectorAll('.ui-search-result__wrapper'),
          ]
          productContainers.map((container) => {
            const priceContainer = container.querySelector(
              '.ui-search-price__second-line'
            )
            const price = priceContainer.querySelector(
              '.price-tag-fraction'
            ).textContent
            const priceInt = parseFloat(price.replace(/\D/g, ''))
            const name = container.querySelector(
              'h2.ui-search-item__title'
            ).textContent
            const url = container
              .querySelector('a.ui-search-link')
              .getAttribute('href')
            productInfo.push([
              {
                Name: name,
                Price: priceInt,
                Url: url,
                Date: date,
                Vendor: 'Meli',
              },
            ])
          })
          return productInfo
        }, date)
        results = [...results, ...output]
        if (currentPage < pagesToScrape) {
          await Promise.all([
            await page.waitForSelector('li.andes-pagination__button'),
            await page.click('li.andes-pagination__button--next'),
          ])
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
    return productQuery(data)
  })
  .then(query=>{
    insertDB(query)
  })
  .then(console.log)
  .then(()=>console.log('Database Updated, chino cagadotaSELECT name,price,url FROM P_Products;SELECT name,price,url FROM P_Products;SELECT name,price,url FROM P_Products;SELECT name,price,url FROM P_Products;s'))
  .catch(console.error)

const productQuery = function (productList) {
  const query = productList
    .map(
      (product) =>
        `("${product[0].Name}", ${product[0].Price}, "${product[0].Url}", "${product[0].Date}", "${product[0].Vendor}")`
    )
    .join(',')
  return query
}