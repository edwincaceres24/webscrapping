function formattingParameters(productInfo) {
  if (productInfo) {
    const parts = productInfo.split(',')

    const name = parts[0].trim()
    const lowPrice = parseInt(parts[1].replace(/\D/g, ''), 10)
    const highPrice = parseInt(parts[2].replace(/\D/g, ''), 10)

    const productArray = [name, lowPrice, highPrice]

    return productArray
  } else {
    console.log('Please provide an input argument.')
  }
}

module.exports = { formattingParameters }
