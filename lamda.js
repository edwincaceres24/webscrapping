const { searchDB } = require('./db')
const { whastappTrigger } = require('./sms')

async function lambda(productName, lowPrice, highPrice) {
  const arrayOfText = productName.split(' ')
  const query1 = `SELECT NAME,PRICE,URL,DATE FROM P_Products WHERE PRICE > ${lowPrice} `
  const query2 = `AND PRICE < ${highPrice} ORDER BY PRICE DESC `
  let builder = ''

  arrayOfText.forEach((element) => {
    builder += `AND NAME LIKE '%${element}%' `
  })

  const finalQuery = query1.concat(builder, query2)
  const result = await searchDB(finalQuery)
  return bodyMessage(result) 
}

function bodyMessage(result) {
  const resultLength=Object.keys(result).length
  if(resultLength<=0){
    console.log('No info to display')
  }else{
    const bodyIntro = `Here are the products you were lookin for: \n`
    let productList=''
    result.forEach(element=>{
      const { NAME, PRICE, URL}= element
      productList+= `🔹 ${NAME} - ${PRICE} - ${URL} \n`
    })

    const finalMessage = bodyIntro.concat(productList)
    whastappTrigger(finalMessage)
  }

}

lambda('Apple Watch Series 7 41 mm', 1499, 1999)

module.exports = lambda
