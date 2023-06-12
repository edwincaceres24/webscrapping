const { whastappTrigger } = require('./sms')
const { shortenUrl } = require('./url-shorten')

function productFiltering(productArray, lowPrice, highPrice, searchTerm) {
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

function bodyMessage(result, productName) {
  const products = result.slice(0, 3)
  if (products.length <= 0) {
    console.log('No info to display')
  } else {
    const bodyIntro = `Here are the best prices for ${productName}: \n`
    let productList = ''
    products.forEach((element) => {
      const { price, url } = element
      // const shortUrl= await shortenUrl(url)
      productList += `* ${price} - ${url} \n`
    })
    const completeMessage = bodyIntro.concat(productList)
    console.log(completeMessage)
    return whastappTrigger(completeMessage)
  }
}

module.exports = { bodyMessage, productFiltering, sortingProducts }
