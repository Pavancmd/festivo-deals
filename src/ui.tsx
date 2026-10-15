
import { useState, type ReactNode } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import type { Product } from './types'
import { best, catOf, inr, storeOf } from './data'

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
  }

  const paths: Record<string, ReactNode> = {
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></>,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    external: <><path d="M14 4h6v6" /><path d="m20 4-9 9" /><path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    spark: <><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z" /><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z" /></>,
    bag: <><path d="M5 8h14l1 12H4L5 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></>,
    tag: <><path d="M20 13 13 20 3 10V3h7l10 10Z" /><circle cx="7.5" cy="7.5" r="1" /></>,
    shield: <><path d="M12 3 20 6v5c0 5-3.4 8.2-8 10-4.6-1.8-8-5-8-10V6l8-3Z" /><path d="m9 12 2 2 4-4" /></>,
    truck: <><path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z" /><circle cx="7" cy="19" r="1.5" /><circle cx="18" cy="19" r="1.5" /></>,
    heart: <path d="M20.8 8.7c0 5.1-8.8 10-8.8 10s-8.8-4.9-8.8-10A4.7 4.7 0 0 1 12 6.1a4.7 4.7 0 0 1 8.8 2.6Z" />,
    grid: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    store: <><path d="M3 10 5 4h14l2 6" /><path d="M4 10v10h16V10M9 20v-6h6v6" /><path d="M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" /></>,
  }

  return <svg {...common}>{paths[name] ?? paths.spark}</svg>
}

export const Loading = () => (
  <div role="status" className="grid place-items-center py-20 text-sm text-slate-500">
    <span className="mb-3 h-8 w-8 animate-spin rounded-full border-2 border-indigo-100 border-t-indigo-600" />
    Loading products…
  </div>
)

export const ErrorBox = ({ msg }: { msg?: string }) => (
  <div role="alert" className="mx-auto my-12 max-w-md rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-800">
    <p className="font-semibold">Could not load products</p>
    <p className="mt-1 text-sm">{msg ?? 'Something went wrong. Refresh the page to try again.'}</p>
  </div>
)

export const DemoBadge = () => (
  <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-amber-800">
    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> SAMPLE DATA
  </span>
)

export const Stars = ({ n }: { n: number }) => (
  <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600" aria-label={`Rating ${n.toFixed(1)} of 5`}>
    <span className="text-amber-500">★</span> {n.toFixed(1)}
  </span>
)

function CategoryMark({ category, size = 22 }: { category: string; size?: number }) {
  const name = (catOf(category)?.name ?? category).toLowerCase()
  let icon = 'bag'

  if (/electronic|phone|laptop|computer|gadget/.test(name)) icon = 'grid'
  else if (/fashion|cloth|wear|beauty|personal/.test(name)) icon = 'heart'
  else if (/home|kitchen|appliance/.test(name)) icon = 'shield'
  else if (/gift|festival/.test(name)) icon = 'spark'
  else if (/travel|outdoor/.test(name)) icon = 'truck'

  return (
    <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-700">
      <Icon name={icon} size={size} />
    </span>
  )
}

export function ProductCard({ p }: { p: Product }) {
  const mrp = Math.max(...p.offers.map((o) => o.mrp))
  const price = best(p)

  return (
    <Link
      to={`/product/${p.id}`}
      className="group flex min-w-0 flex-col rounded-2xl border border-[#e8e5df] bg-white p-3 transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-[0_12px_28px_rgba(45,36,90,0.08)] sm:p-3.5"
    >
      <div aria-hidden className="relative mb-3 flex h-28 items-center justify-center rounded-xl bg-[#f6f4f0] sm:h-32">
        <div className="absolute left-2.5 top-2.5">
          <CategoryMark category={p.category} size={20} />
        </div>
        <div className="text-indigo-700 transition-transform duration-200 group-hover:scale-105">
          <CategoryMark category={p.category} size={35} />
        </div>
        <span className="absolute bottom-2.5 right-2.5 rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold text-slate-500">
          DEMO
        </span>
      </div>

      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
        {catOf(p.category)?.name}
      </p>
      <h3 className="mt-1 line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-[#28243b] group-hover:text-indigo-700">
        {p.name}
      </h3>

      <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <span className="text-base font-bold tracking-tight text-indigo-700">{inr(price)}</span>
        <span className="text-xs text-slate-400 line-through">{inr(mrp)}</span>
      </div>

      <div className="mt-2 flex items-center justify-between gap-2 border-t border-slate-100 pt-2">
        <Stars n={p.rating} />
        <span className="text-[10px] text-slate-500">{p.offers.length} sample stores</span>
      </div>
      <p className="mt-2 text-[10px] font-medium text-amber-700">Illustrative price · not live</p>
    </Link>
  )
}

function retailerSearchUrl(
  retailer: 'Flipkart' | 'Amazon' | 'Google Shopping',
  query: string
) {
  const q = encodeURIComponent(query)

  if (retailer === 'Flipkart') return `https://www.flipkart.com/search?q=${q}`
  if (retailer === 'Amazon') return `https://www.amazon.in/s?k=${q}`

  return `https://www.google.com/search?tbm=shop&q=${q}`
}

export function RetailerSearchLinks({
  query,
  compact = false,
}: {
  query: string
  compact?: boolean
}) {
  const retailers: ('Flipkart' | 'Amazon' | 'Google Shopping')[] = [
    'Flipkart',
    'Amazon',
    'Google Shopping',
  ]

  return (
    <div className={`flex flex-wrap gap-2 ${compact ? 'mt-2' : 'mt-3'}`}>
      {retailers.map((retailer) => (
        <a
          key={retailer}
          href={retailerSearchUrl(retailer, query)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-100 bg-white px-3 py-2 text-xs font-semibold text-indigo-800 transition hover:border-indigo-300 hover:bg-indigo-50"
        >
          {retailer}
          <Icon name="external" size={13} />
        </a>
      ))}
    </div>
  )
}

export function PriceTable({ p }: { p: Product }) {
  const rows = [...p.offers].sort((a, b) => a.price - b.price)

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-indigo-100 bg-[#f4f2ff] p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-indigo-700">
            <Icon name="search" />
          </span>
          <div>
            <p className="font-semibold text-[#28243b]">Check current listings</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Open a retailer to check current product listings. Prices and availability can change.
              These are not affiliate links.
            </p>
          </div>
        </div>
        <RetailerSearchLinks query={p.name} />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#e8e5df] bg-white">
        <table className="w-full min-w-[520px] text-left text-sm">
          <caption className="sr-only">Price comparison using illustrative demo data</caption>
          <thead className="bg-[#f8f7f4] text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="p-3.5">Store</th>
              <th className="p-3.5">Sample price</th>
              <th className="p-3.5">MRP</th>
              <th className="p-3.5">Discount</th>
              <th className="p-3.5">Shipping</th>
              <th className="p-3.5" />
            </tr>
          </thead>
          <tbody>
            {rows.map((o, i) => (
              <tr key={o.store} className="border-t border-slate-100">
                <td className="p-3.5 font-medium text-[#28243b]">
                  <Link className="hover:text-indigo-700 hover:underline" to={`/store/${o.store}`}>
                    {storeOf(o.store)?.name}
                  </Link>
                  {i === 0 && (
                    <span className="ml-2 inline-block rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                      Lowest sample
                    </span>
                  )}
                </td>
                <td className="p-3.5 font-bold text-indigo-700">{inr(o.price)}</td>
                <td className="p-3.5 text-slate-400 line-through">{inr(o.mrp)}</td>
                <td className="p-3.5 text-slate-600">
                  {Math.round((1 - o.price / o.mrp) * 100)}% off
                </td>
                <td className="p-3.5 text-slate-600">{o.shipping}</td>
                <td className="p-3.5">
                  <span className="rounded-lg border border-slate-200 px-2 py-1 text-[10px] text-slate-500">
                    Demo
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const links: [string, string, string][] = [
  ['/', 'Home', 'grid'],
  ['/products', 'Products', 'bag'],
  ['/categories', 'Categories', 'grid'],
  ['/festivals', 'Festivals', 'calendar'],
  ['/stores', 'Stores', 'store'],
  ['/about', 'About', 'shield'],
]

export function Layout() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition ${
      isActive
        ? 'bg-indigo-700 text-white shadow-sm'
        : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-800'
    }`

  return (
    <div className="flex min-h-screen flex-col bg-[#fbfaf7] text-[#28243b]">
      <div className="bg-[#28243b] px-4 py-2 text-center text-[11px] font-medium tracking-wide text-white/85">
        SAMPLE CATALOGUE · Prices are illustrative, not live
      </div>

      <header className="sticky top-0 z-30 border-b border-[#e8e5df] bg-[#fbfaf7]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
          <Link to="/" className="flex shrink-0 items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-700 text-white shadow-sm">
              <Icon name="spark" size={20} />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-base font-bold tracking-tight text-[#28243b] sm:text-lg">
                Festivo <span className="text-indigo-700">Deals</span>
              </span>
              <span className="hidden text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500 sm:block">
                Find your festive picks
              </span>
            </span>
          </Link>

          <nav className="ml-4 hidden items-center gap-1 lg:flex" aria-label="Main">
            {links.slice(1).map(([to, label, icon]) => (
              <NavLink key={to} to={to} className={navClass}>
                <Icon name={icon} size={14} />
                {label}
              </NavLink>
            ))}
          </nav>

          <form
            className="ml-auto hidden w-full max-w-xs items-center gap-2 rounded-xl border border-[#e8e5df] bg-white px-3 py-1.5 md:flex"
            role="search"
            onSubmit={(event) => {
              event.preventDefault()
              const query = new FormData(event.currentTarget).get('q')
              navigate(`/products?q=${encodeURIComponent(String(query ?? ''))}`)
            }}
          >
            <Icon name="search" size={16} />
            <input
              name="q"
              placeholder="Search products…"
              aria-label="Search products"
              className="min-w-0 flex-1 bg-transparent py-1 text-xs outline-none placeholder:text-slate-400"
            />
            <span className="rounded-md bg-slate-50 px-1.5 py-1 text-[10px] text-slate-400">Enter</span>
          </form>

          <button
            type="button"
            className="ml-auto inline-flex items-center gap-2 rounded-xl border border-[#e8e5df] bg-white px-3 py-2 text-xs font-semibold text-slate-700 lg:hidden"
            aria-expanded={open}
            aria-controls="mnav"
            onClick={() => setOpen(!open)}
          >
            <Icon name={open ? 'close' : 'menu'} size={16} />
            {open ? 'Close' : 'Menu'}
          </button>
        </div>

        {open && (
          <nav
            id="mnav"
            aria-label="Mobile"
            className="grid grid-cols-2 gap-2 border-t border-[#e8e5df] px-4 py-3 sm:grid-cols-3 lg:hidden"
            onClick={() => setOpen(false)}
          >
            {links.map(([to, label, icon]) => (
              <NavLink key={to} to={to} className={navClass}>
                <Icon name={icon} size={14} />
                {label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <Outlet />
      </main>

      <footer className="mt-10 border-t border-[#e8e5df] bg-white">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-7 text-xs leading-6 text-slate-500 sm:grid-cols-2 sm:px-6">
          <div>
            <p className="font-display text-sm font-bold text-[#28243b]">
              Festivo <span className="text-indigo-700">Deals</span>
            </p>
            <p className="mt-1">Discover products and explore shopping searches for festivals and shopping events.</p>
          </div>
          <p>
            All catalogue prices, stores, MRPs and discounts are fictional sample data. External retailer
            search links are for convenience and are not affiliate links.{' '}
            <Link className="font-semibold text-indigo-700 underline underline-offset-2" to="/about">
              Read disclosure
            </Link>.
          </p>
        </div>
      </footer>
    </div>
  )
}
