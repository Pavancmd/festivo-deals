// ALL DATA BELOW IS DEMO DATA: fictional products, stores and prices. Not live, not verified.
import type { Category, Festival, Store, Product } from './types'

const C: [string, string, string][] = [
  ['electronics', 'Electronics', '🔌'], ['mobiles', 'Mobiles', '📱'], ['laptops', 'Laptops', '💻'],
  ['fashion', 'Fashion', '👗'], ['beauty', 'Beauty', '💄'], ['furniture', 'Furniture', '🛋️'],
  ['home-kitchen', 'Home & Kitchen', '🍳'], ['appliances', 'Appliances', '🧺'], ['toys', 'Toys', '🧸'],
  ['baby', 'Baby Products', '🍼'], ['books', 'Books', '📚'], ['gaming', 'Gaming', '🎮'],
  ['sports', 'Sports', '🏏'], ['fitness', 'Fitness', '🏋️'], ['automotive', 'Automotive', '🚗'],
  ['groceries', 'Groceries & Gifting', '🍬'], ['jewellery', 'Jewellery', '💍'], ['stationery', 'Stationery', '✏️']
]
export const categories: Category[] = C.map(([slug, name, icon]) => ({ slug, name, icon }))

const F: [string, string, string, string, string[]][] = [
  ['diwali', 'Diwali', 'Oct–Nov (date varies)', 'Lights, gifting and home refresh season.', ['electronics', 'mobiles', 'home-kitchen', 'appliances', 'jewellery', 'groceries', 'furniture', 'fashion']],
  ['holi', 'Holi', 'Mar (date varies)', 'Festival of colours: party wear, skincare and sweets.', ['fashion', 'beauty', 'groceries', 'sports']],
  ['eid', 'Eid', 'Date follows lunar calendar', 'Festive outfits, fragrances and gifts.', ['fashion', 'beauty', 'jewellery', 'groceries', 'home-kitchen']],
  ['christmas', 'Christmas', '25 Dec', 'Gifts for everyone on the list.', ['toys', 'gaming', 'books', 'fashion', 'electronics', 'baby']],
  ['black-friday', 'Black Friday', 'Day after US Thanksgiving', 'The big global sale weekend.', ['electronics', 'laptops', 'mobiles', 'gaming', 'appliances', 'fashion']],
  ['cyber-monday', 'Cyber Monday', 'Monday after Black Friday', 'Online-first tech deals.', ['electronics', 'laptops', 'gaming', 'mobiles', 'stationery']],
  ['chinese-new-year', 'Chinese New Year', 'Jan–Feb (date varies)', 'Home, gifting and family dining.', ['home-kitchen', 'groceries', 'fashion', 'appliances', 'jewellery']],
  ['valentines-day', "Valentine's Day", '14 Feb', 'Gifts for someone special.', ['jewellery', 'beauty', 'fashion', 'groceries', 'books']],
  ['raksha-bandhan', 'Raksha Bandhan', 'Aug (date varies)', 'Gifts between siblings.', ['jewellery', 'groceries', 'fashion', 'electronics', 'books']],
  ['singles-day', "Singles' Day (11.11)", '11 Nov', 'Large online shopping event.', ['electronics', 'beauty', 'fashion', 'home-kitchen', 'fitness']],
  ['back-to-school', 'Back to School', 'Jun–Jul / Aug–Sep', 'Laptops, books and stationery.', ['laptops', 'books', 'stationery', 'electronics', 'sports']],
  ['new-year', 'New Year', '1 Jan', 'Resolutions: fitness, books and fresh gear.', ['fitness', 'sports', 'books', 'stationery', 'automotive']]
]
export const festivals: Festival[] = F.map(([slug, name, when, blurb, cats]) => ({ slug, name, when, blurb, cats }))

export const stores: Store[] = [
  { slug: 'demo-mart', name: 'Demo Mart', blurb: 'Fictional general store used for demo offers.' },
  { slug: 'sample-bazaar', name: 'Sample Bazaar', blurb: 'Fictional marketplace used for demo offers.' },
  { slug: 'example-emporium', name: 'Example Emporium', blurb: 'Fictional electronics-focused store.' },
  { slug: 'test-traders', name: 'Test Traders', blurb: 'Fictional value-focused store.' }
]

const CAT: Record<string, [string, number][]> = {
  electronics: [['Aurora Wireless Earbuds', 2999], ['Nimbus 4K Smart TV 43"', 28999]],
  mobiles: [['Zenith X5 5G Phone', 18999], ['Pebble Lite Phone', 8999]],
  laptops: [['Orbit Air 14 Laptop', 54999], ['Kite Student Laptop', 32999]],
  fashion: [['Saffron Silk Kurta', 1999], ['Indigo Denim Jacket', 2499]],
  beauty: [['Glow Vitamin C Serum', 599], ['Petal Perfume Set', 1299]],
  furniture: [['Oak Lane Study Desk', 7999], ['Cloud Sofa 3-Seater', 22999]],
  'home-kitchen': [['Spice Route Cookware Set', 3499], ['Lumen Diya Lamp Set', 799]],
  appliances: [['Breeze Inverter AC 1.5T', 34999], ['Whirl Front-Load Washer', 27999]],
  toys: [['BrickBuild City Set', 1899], ['Rocket Ride-On Car', 3299]],
  baby: [['Cuddle Baby Stroller', 5999], ['SoftNest Diaper Pack', 899]],
  books: [['The Festival Cookbook', 499], ['Atlas of Markets', 699]],
  gaming: [['Vortex Console 1TB', 39999], ['Pulse Gaming Headset', 3499]],
  sports: [['Willow Pro Cricket Bat', 4499], ['Court King Badminton Kit', 1799]],
  fitness: [['FlexFit Adjustable Dumbbells', 5499], ['Zen Yoga Mat Pro', 999]],
  automotive: [['TrailGuard Dash Camera', 3999], ['AeroClean Car Vacuum', 1499]],
  groceries: [['Mithai Gift Box 1kg', 899], ['Dry Fruit Hamper', 1599]],
  jewellery: [['Lakshmi Gold-Plated Necklace', 3999], ['Silver Charm Bracelet', 1999]],
  stationery: [['Inkwell Fountain Pen Set', 799], ['Plan-It Weekly Planner', 349]]
}

const hash = (s: string) => { let h = 7; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h }

export const products: Product[] = Object.entries(CAT).flatMap(([cat, items]) =>
  items.map(([name, base]) => {
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const offers = stores
      .filter((s, i) => i < 2 || hash(id + s.slug) % 4 !== 0)
      .map((s) => {
        const r = hash(id + s.slug)
        return { store: s.slug, price: Math.round((base * (0.9 + (r % 22) / 100)) / 10) * 10 - 1, mrp: Math.round((base * 1.25) / 10) * 10, shipping: r % 3 === 0 ? 'Free' : '₹49' }
      })
    return {
      id, name, brand: name.split(' ')[0], category: cat, rating: 3.6 + (hash(id) % 14) / 10,
      description: `Demo listing for "${name}". Specs and prices are illustrative sample data.`,
      festivals: festivals.filter((f) => f.cats.includes(cat)).map((f) => f.slug), offers
    }
  })
)

export const inr = (n: number) => '₹' + n.toLocaleString('en-IN')
export const best = (p: Product) => Math.min(...p.offers.map((o) => o.price))
export const catOf = (slug: string) => categories.find((c) => c.slug === slug)
export const storeOf = (slug: string) => stores.find((s) => s.slug === slug)
