const puppeteer = require('puppeteer')
const SEARCH_PRODUCT = process.argv.slice(2)[0]

function run(pagesToScrape) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!pagesToScrape) {
        pagesToScrape = 1
      }

      const browser = await puppeteer.launch({
        headless: false,
        slowMo: 100,
        devtools: true,
        args: ['--window-size=1920,1080'],
        defaultViewport: null,
      })
      const page = await browser.newPage()

      await page.goto('https://www.mercadolibre.com.pe/')
      await page.type('.nav-search-input', SEARCH_PRODUCT)
      await page.click('.nav-icon-search')
      await page.waitForSelector('.ui-search-result__content-wrapper')
      let currentPage = 1
      let results = []
      while (currentPage <= pagesToScrape) {
        let output = await page.evaluate((currentPage) => {
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
            const priceInt = parseInt(price.replace(/\D/g, ''))
            const name = container.querySelector(
              'h2.ui-search-item__title'
            ).textContent
            const url = container
              .querySelector('a.ui-search-link')
              .getAttribute('href')
            productInfo.push({ Name: name, Price: priceInt, Url: url })
          })
          return productInfo
        }, currentPage)
        results.push(output) // Not working as expected
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

run(3).then(console.log).catch(console.error)
