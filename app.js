const puppeteer = require('puppeteer');

const run = async () => {

	const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();
	const productInfo=[] 

  await page.goto('https://www.mercadolibre.com.pe/');

	try{
		
		await page.type('.nav-search-input', 'Iphone')
		await page.click('.nav-icon-search')
		await page.waitForSelector('.ui-search-result__content-wrapper')
		
		const output =await page.evaluate((productInfo)=> {
			
			const productContainers = [...document.querySelectorAll('.ui-search-result__wrapper')] 
			
			productContainers.map(container=>{
			
				const price = container.querySelector('.price-tag-amount').textContent
				const name = container.querySelector('h2.ui-search-item__title').textContent
				productInfo.push({"Name": name, "Price": price})

			})
			console.log(productInfo) //From the browser
		}, productInfo)
	return output

	}catch(err){
		console.log('You have an error:')
		console.error(err)
	}
}

run()
	.then(console.log)
