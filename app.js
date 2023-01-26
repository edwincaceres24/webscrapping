const puppeteer = require('puppeteer');

const runBrowser = async () => {

	const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();
	const productInfo = []; 

  await page.goto('https://www.mercadolibre.com.pe/');

	try{
		
		const searchBox = await page.type('.nav-search-input', 'Iphone')
		const searchButton = await page.click('.nav-icon-search')
		await page.waitForSelector('.ui-search-result__content-wrapper')
		
		await page.evaluate((productInfo)=> {
			const productPrice = [...document.querySelectorAll('.price-tag-amount')]
			const productName = [...document.querySelectorAll('h2.ui-search-item__title')]
			const addingInfo = ()=> productPrice.map(element =>productInfo.push(element.textContent ))
	
		}, productInfo)

		console.log(productInfo)

	}catch(err){
		console.log('You have an error:')
		console.error(err)
	}
}

runBrowser()
