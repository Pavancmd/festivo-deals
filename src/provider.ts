import type { Product } from './types'
import { products } from './data'

/**
 * Data provider contract. To go live, implement this interface against a
 * legitimate feed (e.g. an affiliate product API) and swap `provider` below.
 * Keep API keys on a server/proxy, never in the browser bundle.
 */
export interface DataProvider {
  readonly name: string
  readonly isDemo: boolean
  getProducts(): Promise<Product[]>
  getProduct(id: string): Promise<Product | undefined>
}

export const demoProvider: DataProvider = {
  name: 'Demo dataset',
  isDemo: true,
  getProducts: () => new Promise((res) => setTimeout(() => res(products), 250)),
  getProduct: (id) => new Promise((res) => setTimeout(() => res(products.find((p) => p.id === id)), 150))
}

export const provider: DataProvider = demoProvider
