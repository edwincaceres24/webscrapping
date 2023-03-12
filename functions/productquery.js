const productQuery = function (productList) {
    const query = productList
      .map(
        (product) =>
          `("${product[0].Name}", ${product[0].Price}, "${product[0].Url}", "${product[0].Date}", "${product[0].Vendor}")`
      )
      .join(',')
    return query
  }

module.exports=  productQuery