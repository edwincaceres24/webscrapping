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
		
		let output =await page.evaluate(()=> {
			
			const productInfo=[]  //This should be the output from NodeJs environment
			const productContainers = [...document.querySelectorAll('.ui-search-result__wrapper')] 
			
			productContainers.map(container=>{
			
				const price = container.querySelector('.price-tag-amount').textContent
				const name = container.querySelector('h2.ui-search-item__title').textContent
				productInfo.push({"Name": name, "Price": price})

			})
			console.log(productInfo) //From the browser
			return productInfo;
		})
	return resolve(output)
	}catch(err){
		return reject(err)
	}
})}

run()
	.then(console.log)
	.catch(console.error)
