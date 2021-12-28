import puppeteer  from 'puppeteer';
import productList from './products.json';
//--experimental-json-modules

async function scrapperFalabella(url){
try{ 
   const browser = await puppeteer.launch({
      headless: true,
      args: ['--start-maximized']
   })
   const page = await browser.newPage()
   
   await page.goto(url,{waitUntil: 'networkidle0'})
   
      let answer = await page.evaluate(()=>{
         let grids = document.querySelectorAll('.grid-pod');
         let result = []; 
         grids.forEach((grid)=>{ 
            result.push({
               'Store': 'Falabella',
               'Product name': (grid.querySelector('.pod-subTitle').textContent),
               'Price': `${grid.querySelector('.price-0').textContent}`
            })
          })
         result.length===0 ? result = "N/A" : result

         return result
      }
   )
   console.log("Answer:", answer)
   //await browser.close()
}catch(err){
      console.log("Could not resolve the browser instance => ", err);

   }}


productList.forEach(product=>{
   let item = product.product
   scrapperFalabella("https://www.falabella.com.pe/falabella-pe/search?Ntt="+item.split(' ').join('+'));
})
