const productToSearch = process.argv.slice(2)[0]

function formattingTerm(productInfo) {
  if (productInfo) {
    const parts = productInfo.split(',')

    const name = parts[0].trim()
    const lowPrice = parseInt(parts[1].replace(/\D/g, ''), 10)
    const highPrice = parseInt(parts[2].replace(/\D/g, ''), 10)

    const productArray = [name, lowPrice, highPrice]

    console.log(productArray)
  } else {
    console.log('Please provide an input argument.')
  }
}

formattingTerm(productToSearch)
