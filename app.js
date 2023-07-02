const productScrapping = require('./functions/product-scrapping')
const chromium = require('chrome-aws-lambda')
const {
  bodyMessage,
  productFiltering,
  sortingProducts,
} = require('./functions/lambda')

exports.handler = async (event, context) => {
  const { productName, productLowPrice, productHighPrice } = event

  function run(pagesToScrape) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!pagesToScrape) {
          pagesToScrape = 1
        }

        const browser = await chromium.puppeteer.launch({
          args: chromium.args,
          headless: chromium.headless,
          slowMo: 150,
          executablePath: await chromium.executablePath,
          defaultViewport: null,
          ignoreHTTPSErrors: true,
        })
        const page = await browser.newPage()
        await page.goto('https://www.mercadolibre.com.pe/')
        await page.type('.nav-search-input', productName)
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

  return run(2)
    .then((data) => {
      const items = data.length
      console.log(`${items} products are being scrapped`)
      return productScrapping(data)
    })
    .then((products) =>
      productFiltering(products, productLowPrice, productHighPrice, productName)
    )
    .then((filteredProducts) => sortingProducts(filteredProducts))
    .then((sortedProducts) => bodyMessage(sortedProducts, productName))
    .catch(console.error)
}
