export interface Category { slug: string; name: string; icon: string }
export interface Festival { slug: string; name: string; when: string; blurb: string; cats: string[] }
export interface Store { slug: string; name: string; blurb: string }
export interface Offer { store: string; price: number; mrp: number; shipping: string }
export interface Product {
  id: string; name: string; brand: string; category: string; rating: number
  description: string; festivals: string[]; offers: Offer[]
}
