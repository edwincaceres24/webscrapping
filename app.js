const puppeteer = require('puppeteer');

const runBrowser = async () => {

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://listado.mercadolibre.com.pe/');

	try{
		const h1 = await page.evaluate(() => {
   	 return document.querySelector('h1').innerText})
  	console.log(h1);
	}catch(err){
		console.log('You have an error:')
		console.error(err)
	}
  

	await browser.close();
}

runBrowser()
