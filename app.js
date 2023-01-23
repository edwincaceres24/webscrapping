const puppeteer = require('puppeteer');

const runBrowser = async () => {

	const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();
	let productInfo;

  await page.goto('https://www.mercadolibre.com.pe/');

	try{
		
		const searchBox = await page.type('.nav-search-input', 'Iphone')
		const searchButton = await page.click('.nav-icon-search')
		await page.waitForSelector('.ui-search-result__content-wrapper')
		
		const products = await page.$$eval('.ui-search-result__content-wrapper', elements => {
			console.log(elements.lenght)
			return elements.map(ele=>console.log(ele.textContent))
		})


	}catch(err){
		console.log('You have an error:')
		console.error(err)
	}
}

runBrowser()
