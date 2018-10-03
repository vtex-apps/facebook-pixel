/* eslint-disable camelcase */

export function formatSearchResultProducts(products) {
  return {
    content_ids: products.map(product => product.id),
    contents: products.map(product => ({
      id: product.id,
      item_price: parseFloat(product.price),
      quantity: product.quantity,
    })),
    num_items: products.length,
  }
}
