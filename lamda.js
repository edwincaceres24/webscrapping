const { searchDB } = require('./db')

function lambda(productName, lowPrice, highPrice) {
  const arrayOfText = productName.split(' ')
  const query1 = `SELECT NAME,PRICE,URL,DATE FROM P_Products WHERE PRICE > ${lowPrice} `
  const query2 = `AND PRICE < ${highPrice} ORDER BY PRICE DESC `
  let builder = ''

  arrayOfText.forEach((element) => {
    // builder.concat(`NAME LIKE '%${element}%' AND `)
    builder += `AND NAME LIKE '%${element}%' `
  })

  const finalQuery = query1.concat(builder, query2)
  searchDB(finalQuery)
}

lambda('Apple Watch Series 7 41 mm', 1299, 1999)
