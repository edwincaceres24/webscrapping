const puppeteer = require('puppeteer')

function run(pagesToScrape) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!pagesToScrape) {
        pagesToScrape = 1
      }

      const browser = await puppeteer.launch({
        headless: false,
        slowMo: 0,
        devtools: true,
        args: ['--window-size=1920,1080'],
        defaultViewport: null,
      })
      const page = await browser.newPage()

      await page.goto('https://www.mercadolibre.com.pe/')
      await page.type('.nav-search-input', 'Iphone')
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
            const price =
              container.querySelector('.price-tag-amount').textContent
            const priceInt = parseInt(price.replace(/\D/g, ''))
            const name = container.querySelector(
              'h2.ui-search-item__title'
            ).textContent
            const url = container
              .querySelector('a.ui-search-link')
              .getAttribute('href')
            productInfo.push({ Name: name, Price: priceInt, Url: url })
          })
          console.log(productInfo)
          return productInfo.slice(0, 2) //Just getting the first value to
        }, currentPage)

        results.push(output)
        if (currentPage < pagesToScrape) {
          await Promise.all([
            await page.waitForSelector('li.andes-pagination__button'),
            await page.click('a.andes-pagination__link'),
            console.log(currentPage),
          ])
        }
        currentPage++
      }
      //browser.close()
      return resolve(results)
    } catch (err) {
      return reject(err)
    }
  })
}

run(3).then(console.log).catch(console.error)
