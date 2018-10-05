import { path } from 'ramda'

export function getProductPrice(product: any) {
  return path(['items', 0, 'sellers', 0, 'commertialOffer', 'Price'], product)
}

export function formatSearchResultProducts(products: any[]) {
  return {
    content_ids: products.map(product => product.id),
    contents: products.map(product => {
      const quantity = product.items.reduce((acc: number, sku: any) => {
        const sellersQuantity = sku.sellers.reduce((sellerAcc: number, seller: any) => (
          sellerAcc + seller.commertialOffer.AvailableQuantity
        ), 0)

        return acc + sellersQuantity
      }, 0)

      return {
        id: product.productId,
        item_price: getProductPrice(product),
        quantity,
      }
    }),
    num_items: products.length,
  }
}
