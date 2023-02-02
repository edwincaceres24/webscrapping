const puppeteer = require('puppeteer');

function run() {  

	return new Promise (async (resolve,reject) => {

	try{
	
		const browser = await puppeteer.launch({headless:false});
		const page = await browser.newPage();

 		await page.goto('https://www.mercadolibre.com.pe/');	
		await page.type('.nav-search-input', 'Iphone')
		await page.click('.nav-icon-search')
		await page.waitForSelector('.ui-search-result__content-wrapper')
		


//We must start a loop here
		let output =await page.evaluate(()=> {
			
			const productInfo=[]  
			const productContainers = [...document.querySelectorAll('.ui-search-result__wrapper')] 
			const pages= document.querySelector('.andes-pagination__page-count').textContent
			const pagesCount = parseInt(pages.replace(/\D/g, ''))
			const nextPageButton = document.querySelector('a.andes-pagination__link').getAttribute('href')
			let currentPage = 1
			productContainers.map(container=>{
			
				const price = container.querySelector('.price-tag-amount').textContent
				const name = container.querySelector('h2.ui-search-item__title').textContent
				const url = container.querySelector('a.ui-search-link').getAttribute('href')
				productInfo.push({"Name": name, "Price": price, "Url": url})

			})
			//After this we should concat the results of the current page for what we already have

			//Set an additional conditional to click on next page. Then increase the value
//
			console.log(productInfo) 
			console.log('This is your current page ', currentPage)
			return productInfo 
		})
	return resolve(output)
	}catch(err){
		return reject(err)
	}
})}

run()
	.then(console.log) 
	.catch(console.error)
