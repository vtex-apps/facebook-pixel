import { formatSearchResultProducts, getProductPrice } from './utils/formatHelper'

import pixelScript from './scripts/fbq'

const pixelId = window.__SETTINGS__.pixelId

if (!pixelId) {
  throw new Error('Warning: No FB Pixel ID is defined. To setup the app, take a look at your admin')
}

// tslint:disable-next-line no-eval
eval(pixelScript(window.__SETTINGS__.pixelId))

const trackCategoryPage = (page: string, e: Event) =>
  fbq('track', 'ViewContent', {
    ...formatSearchResultProducts(e.data.products),
    content_category: page,
    content_type: 'product_group',
    currency: e.data.currency,
  })

window.addEventListener('message', e => {
  switch (e.data.eventName) {
    case 'vtex:categoryView': {
      trackCategoryPage('category', e)
      break
    }
    case 'vtex:departmentView': {
      trackCategoryPage('department', e)
      break
    }
    case 'vtex:internalSiteSearchView': {
      fbq('track', 'Search', formatSearchResultProducts(e.data.products))
      break
    }
    case 'vtex:productView': {
      const { product: { productName, productId } } = e.data

      fbq('track', 'ViewContent', {
        content_category: 'product',
        content_ids: [productId],
        content_name: name,
        content_type: 'product',
        currency: e.data.currency,
        value: getProductPrice(e.data.product),
      })
      break
    }
    case 'vtex:addToCart': {
      const { items }: { items: any[] } = e.data

      fbq('track', 'AddToCart', {
        content_ids: items.map(sku => sku.skuId),
        contents: items.map(sku => ({
          id: sku.skuId,
          quantity: sku.quantity,
          item_price: sku.price,
        })),
        content_type: 'product',
        currency: e.data.currency,
      })
      break
    }
    default:
      break
  }
})
