import { getProductPrice } from './utils/formatHelper'
import { ProductOrder, PixelMessage } from './typings/events'

window.addEventListener('message', (e : PixelMessage) => {
  switch (e.data.eventName) {
    case 'vtex:pageView': {
      fbq('track', 'PageView')
      break
    }
    case 'vtex:orderPlaced': {
      const { currency, transactionTotal, transactionProducts } = e.data

      fbq('track', 'Purchase', {
        value: transactionTotal,
        currency,
        content_type: 'product',
        contents: transactionProducts.map(
          (product: ProductOrder) => ({
            id: product.sku,
            quantity: product.quantity,
            item_price: product.sellingPrice
          })
        )
      });
      break
    }
    case 'vtex:productView': {
      const { product: { productId, productName }, currency } = e.data

      fbq('track', 'ViewContent', {
        content_ids: [productId],
        content_name: productName,
        content_type: 'product',
        currency,
        value: getProductPrice(e.data.product),
      })
      break
    }
    case 'vtex:addToCart': {
      const { items, currency } = e.data

      fbq('track', 'AddToCart', {
        value: items.reduce((acc, item) => acc + item.price, 0),
        content_ids: items.map(sku => sku.skuId),
        contents: items.map(sku => ({
          id: sku.skuId,
          quantity: sku.quantity,
          item_price: sku.price,
        })),
        content_type: 'product',
        currency: currency,
      })
      break
    }
    default:
      break
  }
})
