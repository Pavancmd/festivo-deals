import type { ReactNode } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { best, catOf, categories, festivals, inr, stores, storeOf } from '../data'
import { provider } from '../provider'
import { useAsync } from '../useAsync'
import { DemoBadge, ErrorBox, Loading, PriceTable, ProductCard, Stars } from '../ui'

const H1 = ({ children }: { children: ReactNode }) => <h1 className="mb-2 text-3xl font-bold sm:text-4xl">{children}</h1>
const sel = 'rounded-lg border border-ink/20 bg-white px-3 py-2 text-sm'

function ProductList({ cat, festival, store, title, intro }: { cat?: string; festival?: string; store?: string; title: string; intro?: string }) {
  const [sp, setSp] = useSearchParams()
  const { d, e, l } = useAsync(() => provider.getProducts(), [])
  const set = (k: string, v: string) => { const n = new URLSearchParams(sp); v ? n.set(k, v) : n.delete(k); setSp(n, { replace: true }) }
  const q = (sp.get('q') ?? '').toLowerCase().trim(), c = cat ?? sp.get('category') ?? '', st = store ?? sp.get('store') ?? ''
  const max = Number(sp.get('max')) || 0, sort = sp.get('sort') ?? 'rel'
  let list = (d ?? []).filter((p) => (!c || p.category === c) && (!festival || p.festivals.includes(festival)) &&
    (!q || `${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(q)) && (!st || p.offers.some((o) => o.store === st)) && (!max || best(p) <= max))
  if (sort === 'low') list = [...list].sort((a, b) => best(a) - best(b))
  if (sort === 'high') list = [...list].sort((a, b) => best(b) - best(a))
  if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating)
  return (
    <div>
      <H1>{title}</H1>{intro && <p className="mb-4 max-w-2xl text-ink/70">{intro}</p>}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <input aria-label="Search" placeholder="Search…" defaultValue={sp.get('q') ?? ''} key={sp.get('q') ?? ''} onChange={(ev) => set('q', ev.target.value)} className={`${sel} w-48`} />
        {!cat && <select aria-label="Category" className={sel} value={c} onChange={(ev) => set('category', ev.target.value)}><option value="">All categories</option>{categories.map((x) => <option key={x.slug} value={x.slug}>{x.name}</option>)}</select>}
        {!store && <select aria-label="Store" className={sel} value={st} onChange={(ev) => set('store', ev.target.value)}><option value="">All stores</option>{stores.map((x) => <option key={x.slug} value={x.slug}>{x.name}</option>)}</select>}
        <select aria-label="Maximum price" className={sel} value={String(max || '')} onChange={(ev) => set('max', ev.target.value)}>
          <option value="">Any price</option>{[1000, 5000, 20000, 50000].map((m) => <option key={m} value={m}>Under {inr(m)}</option>)}</select>
        <select aria-label="Sort" className={sel} value={sort} onChange={(ev) => set('sort', ev.target.value)}>
          <option value="rel">Sort: Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="rating">Rating</option></select>
        <DemoBadge />
      </div>
      {l ? <Loading /> : e ? <ErrorBox msg={e} /> : list.length === 0 ? (
        <p className="rounded-xl border border-dashed border-ink/20 p-10 text-center text-ink/70">No products match. Try clearing a filter or search term.</p>
      ) : (<>
        <p className="mb-3 text-sm text-ink/60">{list.length} products</p>
        <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </>)}
    </div>
  )
}

export const ProductsPage = () => <ProductList title="All products" intro="Search, filter and sort the demo catalogue." />
export const CategoryPage = () => { const { slug = '' } = useParams(); const c = catOf(slug); return c ? <ProductList cat={slug} title={`${c.icon} ${c.name}`} /> : <NotFound /> }
export const StorePage = () => { const { slug = '' } = useParams(); const s = storeOf(slug); return s ? <ProductList store={slug} title={s.name} intro={s.blurb} /> : <NotFound /> }
export const FestivalPage = () => {
  const { slug = '' } = useParams(); const f = festivals.find((x) => x.slug === slug)
  return f ? <ProductList festival={slug} title={f.name} intro={`${f.when}. ${f.blurb}`} /> : <NotFound />
}

export function Home() {
  const { d, l, e } = useAsync(() => provider.getProducts(), [])
  const top = [...(d ?? [])].sort((a, b) => b.rating - a.rating).slice(0, 8)
  return (
    <div className="space-y-14">
      <section className="rounded-2xl bg-ink px-6 py-14 text-ivory sm:px-12">
        <h1 className="max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">Every festival has a sale. Compare before you buy.</h1>
        <p className="mt-4 max-w-xl text-ivory/75">From Diwali to Black Friday, see one product across several stores side by side. Currently showing a clearly labelled demo catalogue.</p>
        <form action="/products" className="mt-6 flex max-w-lg gap-2" role="search">
          <input name="q" aria-label="Search products" placeholder="Try “laptop” or “gift”" className="min-w-0 flex-1 rounded-lg px-4 py-3 text-ink" />
          <button className="rounded-lg bg-saffron px-5 font-semibold text-ink hover:brightness-95">Search</button>
        </form>
      </section>
      <section>
        <div className="mb-4 flex items-end justify-between"><h2 className="text-2xl font-bold">Festivals and shopping events</h2><Link className="text-sm text-indigo-700 underline" to="/festivals">See all</Link></div>
        <div className="flex gap-3 overflow-x-auto pb-2">{festivals.map((f) => (
          <Link key={f.slug} to={`/festival/${f.slug}`} className="min-w-[10rem] rounded-xl border border-saffron/40 bg-amber-50 p-4 hover:border-saffron"><p className="font-display font-semibold">{f.name}</p><p className="text-xs text-ink/60">{f.when}</p></Link>))}</div>
      </section>
      <section>
        <h2 className="mb-4 text-2xl font-bold">Shop by category</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{categories.map((c) => (
          <Link key={c.slug} to={`/category/${c.slug}`} className="rounded-xl border border-ink/10 bg-white p-4 text-center hover:border-indigo-400"><div aria-hidden className="text-3xl">{c.icon}</div><p className="mt-1 text-sm font-medium">{c.name}</p></Link>))}</div>
      </section>
      <section>
        <div className="mb-4 flex items-center gap-3"><h2 className="text-2xl font-bold">Top rated</h2><DemoBadge /></div>
        {l ? <Loading /> : e ? <ErrorBox msg={e} /> : <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4">{top.map((p) => <ProductCard key={p.id} p={p} />)}</div>}
      </section>
    </div>
  )
}

export function ProductPage() {
  const { id = '' } = useParams()
  const { d: p, l, e } = useAsync(() => provider.getProduct(id), [id])
  const rel = useAsync(() => provider.getProducts(), [])
  if (l) return <Loading />
  if (e) return <ErrorBox msg={e} />
  if (!p) return <NotFound />
  const hi = Math.max(...p.offers.map((o) => o.price))
  return (
    <div>
      <p className="mb-4 text-sm"><Link className="text-indigo-700 underline" to={`/category/${p.category}`}>{catOf(p.category)?.name}</Link> / {p.name}</p>
      <div className="grid gap-8 md:grid-cols-[18rem_1fr]">
        <div aria-hidden className="grid h-64 place-items-center rounded-2xl bg-gradient-to-br from-indigo-50 to-amber-50 text-8xl">{catOf(p.category)?.icon}</div>
        <div><H1>{p.name}</H1><div className="mb-3 flex items-center gap-3"><Stars n={p.rating} /><DemoBadge /></div>
          <p className="text-ink/75">{p.description}</p>
          <p className="mt-3 text-2xl font-semibold text-indigo-700">From {inr(best(p))}</p>
          <p className="text-sm text-ink/60">Spread across {p.offers.length} demo stores: {inr(hi - best(p))} between highest and lowest.</p>
          <div className="mt-3 flex flex-wrap gap-2">{p.festivals.map((f) => <Link key={f} to={`/festival/${f}`} className="rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-900">{festivals.find((x) => x.slug === f)?.name}</Link>)}</div>
        </div>
      </div>
      <h2 className="mb-3 mt-10 text-2xl font-bold">Compare prices</h2>
      <PriceTable p={p} />
      <p className="mt-2 text-xs text-ink/60">Demo prices for illustration. Not live or verified.</p>
      <h2 className="mb-3 mt-10 text-2xl font-bold">More in {catOf(p.category)?.name}</h2>
      <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4">{(rel.d ?? []).filter((x) => x.category === p.category && x.id !== p.id).map((x) => <ProductCard key={x.id} p={x} />)}</div>
    </div>
  )
}

export const Categories = () => (
  <div><H1>Categories</H1><div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{categories.map((c) => (
    <Link key={c.slug} to={`/category/${c.slug}`} className="rounded-xl border border-ink/10 bg-white p-5 text-center hover:border-indigo-400"><div aria-hidden className="text-4xl">{c.icon}</div><p className="mt-2 text-sm font-medium">{c.name}</p></Link>))}</div></div>
)
export const Festivals = () => (
  <div><H1>Festivals and shopping events</H1><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{festivals.map((f) => (
    <Link key={f.slug} to={`/festival/${f.slug}`} className="rounded-xl border border-saffron/40 bg-amber-50 p-5 hover:border-saffron"><h2 className="text-xl font-semibold">{f.name}</h2><p className="text-xs text-ink/60">{f.when}</p><p className="mt-2 text-sm text-ink/75">{f.blurb}</p></Link>))}</div></div>
)
export const Stores = () => (
  <div><H1>Stores</H1><p className="mb-6 text-ink/70">Fictional demo stores. No real retailer is represented.</p><div className="grid gap-4 sm:grid-cols-2">{stores.map((s) => (
    <Link key={s.slug} to={`/store/${s.slug}`} className="rounded-xl border border-ink/10 bg-white p-5 hover:border-indigo-400"><h2 className="text-xl font-semibold">{s.name}</h2><p className="text-sm text-ink/70">{s.blurb}</p></Link>))}</div></div>
)
export const About = () => (
  <div className="max-w-2xl space-y-4"><H1>About and disclosure</H1>
    <p>Festivo Deals is a price-comparison prototype for festivals and shopping events around the world.</p>
    <ul className="list-disc space-y-1 pl-5 text-ink/80">
      <li>Every product, store, price, MRP and discount shown is fictional demo data.</li>
      <li>Nothing here is a live, verified or lowest-price claim. “Lowest in demo data” refers only to the sample numbers.</li>
      <li>No coupon codes or affiliate partnerships exist in this version.</li>
      <li>If live affiliate links are added later, they will be disclosed clearly on this page.</li></ul>
    <p>The data layer is a provider interface, ready for legitimate live shopping feeds.</p></div>
)
export const NotFound = () => (
  <div className="py-20 text-center"><p className="text-6xl">🪔</p><H1>Page not found</H1><p className="mb-6 text-ink/70">That page doesn't exist or has moved.</p><Link className="rounded-lg bg-indigo-600 px-5 py-2.5 text-white" to="/">Back to home</Link></div>
)
