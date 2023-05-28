const { whastappTrigger } = require('./sms')

function productFiltering(productArray, lowPrice, highPrice,searchTerm) {
  const result = Array.from(productArray).filter((productItem) => {
    const { name, price } = productItem
    const searchTermArray = searchTerm.split(' ')

    return (
      price >= lowPrice &&
      price <= highPrice &&
      searchTermArray.some((word) => name.includes(word))
    )
  })

  const resultQuantity = result.length
  console.log(`${resultQuantity} products were filtered`)
  return result
}

function sortingProducts(filteredArray) {
  const result = filteredArray.sort((a, b) => a.price - b.price)
  return result
}

function bodyMessage(result) {
  const products = result.slice(0,3)
  if (products.length <= 0) {
    console.log('No info to display')
  } else {
    const bodyIntro = `Here are the products you were lookin for: \n`
    let productList = ''
    products.forEach((element) => {
      const { name, price, url } = element
      productList += `🔹 ${name} - ${price} - ${url} \n`
    })

    const completeMessage = bodyIntro.concat(productList)
    whastappTrigger(completeMessage)
  }
}

module.exports = { bodyMessage, productFiltering, sortingProducts }
