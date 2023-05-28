const puppeteer = require('puppeteer')
const formattedDate = require('./date')

function productScrapping(urlArray){
  return new Promise(async (resolve, reject) => {
    try{
        const browser = await puppeteer.launch({
            headless: true,
            slowMo: 150,
            devtools: true,
            args: ['--window-size=1920,1080'],
            defaultViewport: null,
        })
        const page = await browser.newPage()
        const productData = []

        for (const url of urlArray){
            await page.goto(url)
            try{

            const sellerRate = await page.$eval('.ui-seller-info .ui-thermometer', attr=> attr.getAttribute('value'))
            const sellerRateInt = parseInt(sellerRate)

            const nameElement = await page.$('h1')
            const priceElement = await page.$('.ui-pdp-price__second-line .andes-money-amount__fraction')
            
            const name = await page.evaluate(element => element.textContent, nameElement);
            const price = await page.evaluate(element => element.textContent, priceElement);
            const priceNumber = parseFloat(price.replace(/\D/g, ''))
            const date = await page.evaluate( date => date, formattedDate)
            
            if (sellerRateInt==5){
            productData.push({ 
                    name: name, 
                    price: priceNumber,
                    url: url, 
                    date: date, 
                    vendor: 'Meli'
                }
            )}
            }catch(err){
                console.error(err)
            }
        }
        return resolve(productData)
    }
    catch(e){
        return reject(e)
    }
  })
}

module.exports= productScrapping 