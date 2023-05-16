const puppeteer = require('puppeteer')
const productToSearch = process.argv.slice(2)[0]
const formattedDate = require('./functions/date')
const productQuery = require('./functions/productquery')
const { insertDB } = require('./db')

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
            //Remove **
            // const priceContainer = container.querySelector(
            //   '.ui-search-price__second-line'
            // )
            // const price = priceContainer.querySelector(
            //   '.price-tag-fraction'
            // ).textContent
            // const priceInt = parseFloat(price.replace(/\D/g, ''))
            // const name = container.querySelector(
            //   'h2.ui-search-item__title'
            // ).textContent
            // Until here
            const url = container
              .querySelector('a.ui-search-link')
              .getAttribute('href')
            productInfo.push([
              {
                // name: name,
                // price: priceInt,
                // url: url,
                url: url,
                // date: date,
                // vendor: 'Meli',
              },
            ])
          })
          return productInfo
        }, formattedDate)
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
  .then((data) => console.log(data))
  // .then((data) => productQuery(data))
  // .then((query) => {
  //   insertDB(query[0])
  //   console.log(`Database updated with ${query[1]} new registers`)
  // })
  .catch(console.error)
