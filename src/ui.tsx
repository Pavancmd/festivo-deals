import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import type { Product } from './types'
import { best, catOf, inr, storeOf } from './data'

export const Loading = () => (
  <div role="status" className="grid place-items-center py-24 text-ink/60">
    <div className="mb-3 h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />Loading demo data…
  </div>
)
export const ErrorBox = ({ msg }: { msg?: string }) => (
  <div role="alert" className="mx-auto my-16 max-w-md rounded-xl border border-red-200 bg-red-50 p-5 text-red-800">
    <p className="font-semibold">Could not load products</p>
    <p className="text-sm">{msg ?? 'Something went wrong. Refresh the page to try again.'}</p>
  </div>
)
export const DemoBadge = () => (
  <span className="rounded-full bg-saffron/20 px-2 py-0.5 text-xs font-medium text-amber-800">Demo data</span>
)
export const Stars = ({ n }: { n: number }) => <span className="text-xs text-amber-600" aria-label={`Rating ${n.toFixed(1)} of 5`}>★ {n.toFixed(1)}</span>

export function ProductCard({ p }: { p: Product }) {
  const mrp = Math.max(...p.offers.map((o) => o.mrp))
  const b = best(p)
  return (
    <Link to={`/product/${p.id}`} className="block rounded-xl border border-ink/10 bg-white p-4 transition hover:border-indigo-400 hover:shadow-md">
      <div aria-hidden className="mb-3 grid h-32 place-items-center rounded-lg bg-gradient-to-br from-indigo-50 to-amber-50 text-5xl">{catOf(p.category)?.icon}</div>
      <p className="text-xs text-ink/60">{catOf(p.category)?.name}</p>
      <h3 className="mt-0.5 text-base font-semibold leading-snug">{p.name}</h3>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-lg font-semibold text-indigo-700">{inr(b)}</span>
        <span className="text-sm text-ink/50 line-through">{inr(mrp)}</span>
      </div>
      <div className="mt-2 flex items-center justify-between"><Stars n={p.rating} /><span className="text-xs text-ink/60">{p.offers.length} stores</span></div>
    </Link>
  )
}

export function PriceTable({ p }: { p: Product }) {
  const rows = [...p.offers].sort((a, b) => a.price - b.price)
  return (
    <div className="overflow-x-auto rounded-xl border border-ink/10 bg-white">
      <table className="w-full min-w-[520px] text-left text-sm">
        <caption className="sr-only">Price comparison (demo data)</caption>
        <thead className="bg-indigo-50 text-ink/70"><tr>
          <th className="p-3">Store</th><th className="p-3">Price</th><th className="p-3">MRP</th><th className="p-3">Discount</th><th className="p-3">Shipping</th><th className="p-3" />
        </tr></thead>
        <tbody>
          {rows.map((o, i) => (
            <tr key={o.store} className="border-t border-ink/10">
              <td className="p-3 font-medium"><Link className="hover:underline" to={`/store/${o.store}`}>{storeOf(o.store)?.name}</Link>
                {i === 0 && <span className="ml-2 rounded bg-indigo-600 px-1.5 py-0.5 text-xs text-white">Lowest in demo data</span>}</td>
              <td className="p-3 font-semibold text-indigo-700">{inr(o.price)}</td>
              <td className="p-3 text-ink/50 line-through">{inr(o.mrp)}</td>
              <td className="p-3">{Math.round((1 - o.price / o.mrp) * 100)}% off</td>
              <td className="p-3">{o.shipping}</td>
              <td className="p-3"><button disabled className="cursor-not-allowed rounded-lg border border-ink/20 px-3 py-1 text-xs text-ink/50" title="Demo: no live store link">No live link</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const links: [string, string][] = [['/products', 'Products'], ['/categories', 'Categories'], ['/festivals', 'Festivals'], ['/stores', 'Stores'], ['/about', 'About']]

export function Layout() {
  const [open, setOpen] = useState(false)
  const nav = useNavigate()
  const cls = ({ isActive }: { isActive: boolean }) => `rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-50'}`
  return (
    <div className="flex min-h-screen flex-col">
      <div className="bg-ink py-1.5 text-center text-xs text-ivory">Prototype with demo data. Prices are illustrative, not live.</div>
      <header className="sticky top-0 z-20 border-b border-ink/10 bg-ivory/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <Link to="/" className="font-display text-xl font-bold text-indigo-700">🪔 Festivo Deals</Link>
          <nav className="ml-4 hidden gap-1 md:flex" aria-label="Main">{links.map(([to, l]) => <NavLink key={to} to={to} className={cls}>{l}</NavLink>)}</nav>
          <form className="ml-auto hidden md:block" role="search" onSubmit={(e) => { e.preventDefault(); const q = new FormData(e.currentTarget).get('q'); nav(`/products?q=${encodeURIComponent(String(q ?? ''))}`) }}>
            <input name="q" placeholder="Search products" aria-label="Search products" className="w-56 rounded-lg border border-ink/20 bg-white px-3 py-2 text-sm" />
          </form>
          <button className="ml-auto rounded-lg border border-ink/20 px-3 py-2 text-sm md:hidden" aria-expanded={open} aria-controls="mnav" onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}</button>
        </div>
        {open && (
          <nav id="mnav" aria-label="Mobile" className="flex flex-col gap-1 border-t border-ink/10 px-4 py-3 md:hidden" onClick={() => setOpen(false)}>
            {links.map(([to, l]) => <NavLink key={to} to={to} className={cls}>{l}</NavLink>)}
          </nav>
        )}
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8"><Outlet /></main>
      <footer className="border-t border-ink/10 bg-white">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-8 text-sm text-ink/70 sm:grid-cols-2">
          <p><b className="font-display text-ink">Festivo Deals</b><br />Compare prices across stores for festivals and shopping events worldwide.</p>
          <p>All products, stores, prices and discounts are fictional demo data. No affiliate partnerships or coupon codes are claimed. <Link className="underline" to="/about">Read the disclosure</Link>.</p>
        </div>
      </footer>
    </div>
  )
}
