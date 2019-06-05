import { Product } from "../typings/events"

export function getProductPrice(product: Product) {
  let price
  try {
    price = product.items[0].sellers[0].commertialOffer.Price
  } catch {
    price = undefined
  }
  return price
}
