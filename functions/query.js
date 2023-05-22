const productQuery = function (productList) {
    const productLength=Array.from(productList).length
    const query = productList
      .map(
        (product) =>
          `("${product[0].name}", ${product[0].price}, "${product[0].url}", "${product[0].date}", "${product[0].vendor}")`
      )
      .join(',')
    return  [query,productLength]
  }

module.exports=  productQuery