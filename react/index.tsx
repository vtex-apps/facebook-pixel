import { formatSearchResultProducts, getProductPrice } from './utils/formatHelper'

const currency = __RUNTIME__.culture.currency

const track = (eventName: string, data: any) => {
  fbq('track', eventName, data)
}

const trackCategoryPage = (page: string) => {
  return (e: Event) => {
    track('ViewContent', {
      ...formatSearchResultProducts(e.data.products),
      content_category: page,
      content_type: 'product_group',
      currency,
    })
  }
}

window.addEventListener('vtex:departmentView', trackCategoryPage('department'))

window.addEventListener('vtex:categoryView', trackCategoryPage('category'))

window.addEventListener('vtex:internalSiteSearchView', e => {
  track('Search', formatSearchResultProducts(e.data.products))
})

window.addEventListener('vtex:productView', e => {
  const { product: { productName, productId } } = e.data

  track('ViewContent', {
    content_category: 'product',
    content_ids: [productId],
    content_name: name,
    content_type: 'product',
    currency,
    value: getProductPrice(e.data.product),
  })
})
