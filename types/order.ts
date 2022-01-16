import { IProvice } from './province'

export enum IOrderStatus {
  Cancelled = 'Cancelled',
  Shipped = 'Shipped'
}
export enum IItemStatus {
  Cancelled = 'Cancelled',
  Shipped = 'Shipped'
}
export interface IOrder {
  'amazon-order-id': string
  'merchant-order-id': string
  'purchase-date': string
  'last-updated-date': string
  'order-status': IOrderStatus
  'fulfillment-channel': string
  'sales-channel': string
  'order-channel': string
  url: string
  'ship-service-level': string
  'product-name': string
  sku: string
  asin: string
  'item-status': IItemStatus
  quantity: string
  currency: string
  'item-price': string
  'item-tax': string
  'shipping-price': string
  'shipping-tax': string
  'gift-wrap-price': string
  'gift-wrap-tax': string
  'item-promotion-discount': string
  'ship-promotion-discount': string
  'ship-city': string
  'ship-state': IProvice
  'ship-postal-code': string
  'ship-country': string
  'promotion-ids': string
  'is-business-order': string
  'purchase-order-number': string
  'price-designation ': string
}
