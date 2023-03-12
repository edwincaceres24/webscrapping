const productQuery = function (productList) {
    const productLength=Array.from(productList).length
    const query = productList
      .map(
        (product) =>
          `("${product[0].Name}", ${product[0].Price}, "${product[0].Url}", "${product[0].Date}", "${product[0].Vendor}")`
      )
      .join(',')
    return  [query,productLength]
  }

module.exports=  productQuery