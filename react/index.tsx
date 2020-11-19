import { ProductOrder, PixelMessage, Product } from './typings/events'
import { canUseDOM } from 'vtex.render-runtime'

function handleMessages(e: PixelMessage) {
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
      const { product: { productName, productId, items }, currency } = e.data

      // The event varies if the product has SKUs, see:
      // https://developers.facebook.com/docs/marketing-api/audiences/guides/dynamic-product-audiences#
      const noVariants = items.length === 1
      if (noVariants) {
        fbq('track', 'ViewContent', {
          content_ids: [items[0].itemId],
          content_name: productName,
          content_type: 'product',
          currency,
          value: getProductPrice(e.data.product),
        })
        return
      }

      fbq('track', 'ViewContent', {
        content_ids: [productId],
        content_name: productName,
        content_type: 'product_group',
        currency,
        value: getProductPrice(e.data.product),
      })
      break
    }
    case 'vtex:addToCart': {
      const { items, currency } = e.data

      fbq('track', 'AddToCart', {
        value: items.reduce((acc, item) => acc + item.price, 0) / 100,
        content_ids: items.map(sku => sku.skuId),
        contents: items.map(sku => ({
          id: sku.skuId,
          quantity: sku.quantity,
          item_price: sku.price / 100,
        })),
        content_type: 'product',
        currency: currency,
      })
      break
    }
    default:
      break
  }
}

function getProductPrice(product: Product) {
  let price
  try {
    price = product.items[0].sellers[0].commertialOffer.Price
  } catch {
    price = undefined
  }
  return price
}


if (canUseDOM) {
  window.addEventListener('message', handleMessages)
}
