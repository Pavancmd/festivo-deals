
import type { ReactNode } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import {
  best,
  catOf,
  categories,
  festivals,
  inr,
  stores,
  storeOf,
} from '../data'
import { provider } from '../provider'
import { useAsync } from '../useAsync'
import {
  DemoBadge,
  ErrorBox,
  Loading,
  PriceTable,
  ProductCard,
  RetailerSearchLinks,
  Stars,
} from '../ui'

const H1 = ({ children }: { children: ReactNode }) => (
  <h1 className="text-2xl font-bold tracking-tight text-[#28243b] sm:text-3xl">
    {children}
  </h1>
)

const H2 = ({ children }: { children: ReactNode }) => (
  <h2 className="text-lg font-bold tracking-tight text-[#28243b] sm:text-xl">
    {children}
  </h2>
)

const selectClass =
  'rounded-xl border border-[#e5e2dc] bg-white px-3 py-2.5 text-xs text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'

function CategoryIcon({ slug }: { slug: string }) {
  const paths: Record<string, ReactNode> = {
    electronics: (
      <>
        <rect x="4" y="4" width="16" height="12" rx="2" />
        <path d="M8 20h8M12 16v4" />
      </>
    ),
    fashion: (
      <>
        <path d="M8 5 12 7l4-2 4 4-3 3-2-2v10H9V10l-2 2-3-3 4-4Z" />
      </>
    ),
    home: (
      <>
        <path d="m3 11 9-7 9 7" />
        <path d="M5 10v10h14V10M9 20v-6h6v6" />
      </>
    ),
    beauty: (
      <>
        <path d="M9 3h6M10 3v5l-5 9a3 3 0 0 0 3 4h8a3 3 0 0 0 3-4l-5-9V3" />
        <path d="M8 15h8" />
      </>
    ),
    gifts: (
      <>
        <rect x="4" y="10" width="16" height="10" rx="1" />
        <path d="M3 7h18v3H3zM12 7v13M12 7H8a2 2 0 1 1 2-2l2 2Zm0 0h4a2 2 0 1 0-2-2l-2 2Z" />
      </>
    ),
    appliances: (
      <>
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <path d="M8 7h8M8 11h8M9 17h.01M13 17h.01" />
      </>
    ),
    books: (
      <>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 1 4 17.5v-12Z" />
        <path d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20M8 7h8M8 10h6" />
      </>
    ),
    sports: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m7 5 4 4-2 5-5 1M11 9l6-2 4 4-3 5-5-2M9 14l3 6" />
      </>
    ),
  }

  const fallback = (
    <path d="m12 3 2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2L12 3Z" />
  )

  return (
    <span
      aria-hidden="true"
      className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-700"
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {paths[slug] ?? fallback}
      </svg>
    </span>
  )
}

function ProductList({
  cat,
  festival,
  store,
  title,
  intro,
}: {
  cat?: string
  festival?: string
  store?: string
  title: string
  intro?: string
}) {
  const [searchParams, setSearchParams] = useSearchParams()
  const { d, e, l } = useAsync(() => provider.getProducts(), [])

  const setFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams)

    if (value) {
      next.set(key, value)
    } else {
      next.delete(key)
    }

    setSearchParams(next, { replace: true })
  }

  const query = (searchParams.get('q') ?? '').toLowerCase().trim()
  const category = cat ?? searchParams.get('category') ?? ''
  const selectedStore = store ?? searchParams.get('store') ?? ''
  const maxPrice = Number(searchParams.get('max')) || 0
  const sort = searchParams.get('sort') ?? 'rel'

  let products = (d ?? []).filter((product) => {
    const matchesCategory =
      !category || product.category === category

    const matchesFestival =
      !festival || product.festivals.includes(festival)

    const matchesQuery =
      !query ||
      `${product.name} ${product.brand} ${product.category}`
        .toLowerCase()
        .includes(query)

    const matchesStore =
      !selectedStore ||
      product.offers.some((offer) => offer.store === selectedStore)

    const matchesPrice =
      !maxPrice || best(product) <= maxPrice

    return (
      matchesCategory &&
      matchesFestival &&
      matchesQuery &&
      matchesStore &&
      matchesPrice
    )
  })

  if (sort === 'low') {
    products = [...products].sort((a, b) => best(a) - best(b))
  }

  if (sort === 'high') {
    products = [...products].sort((a, b) => best(b) - best(a))
  }

  if (sort === 'rating') {
    products = [...products].sort((a, b) => b.rating - a.rating)
  }

  const festivalName = title.replace(/^\S+\s/, '')

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2 border-b border-[#e8e5df] pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-700">
            Discover & compare
          </p>
          <H1>{title}</H1>
          {intro && (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              {intro}
            </p>
          )}
        </div>
        <DemoBadge />
      </div>

      {festival && (
        <section className="rounded-2xl border border-indigo-100 bg-[#f4f2ff] p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-indigo-700">
              ✧
            </span>
            <div>
              <h2 className="font-semibold text-[#28243b]">
                Explore {festivalName} shopping
              </h2>
              <p className="mt-1 text-xs leading-5 text-slate-600">
                Search external retailer listings for gifts and shopping
                ideas. These are not verified offers or live price comparisons.
              </p>
              <RetailerSearchLinks
                query={`${festivalName} gifts deals`}
                compact
              />
            </div>
          </div>
        </section>
      )}

      <div className="rounded-2xl border border-[#e8e5df] bg-white p-3 sm:p-4">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-slate-600">
          <span className="text-indigo-700">▤</span>
          Refine your search
        </div>

        <div className="flex flex-wrap gap-2">
          <input
            aria-label="Search products"
            placeholder="Search products…"
            value={searchParams.get('q') ?? ''}
            onChange={(event) => setFilter('q', event.target.value)}
            className={`${selectClass} min-w-0 flex-1 sm:min-w-48`}
          />

          {!cat && (
            <select
              aria-label="Category"
              className={selectClass}
              value={category}
              onChange={(event) => setFilter('category', event.target.value)}
            >
              <option value="">All categories</option>
              {categories.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          )}

          {!store && (
            <select
              aria-label="Store"
              className={selectClass}
              value={selectedStore}
              onChange={(event) => setFilter('store', event.target.value)}
            >
              <option value="">All stores</option>
              {stores.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          )}

          <select
            aria-label="Maximum price"
            className={selectClass}
            value={String(maxPrice || '')}
            onChange={(event) => setFilter('max', event.target.value)}
          >
            <option value="">Any price</option>
            {[1000, 5000, 20000, 50000].map((price) => (
              <option key={price} value={price}>
                Under {inr(price)}
              </option>
            ))}
          </select>

          <select
            aria-label="Sort products"
            className={selectClass}
            value={sort}
            onChange={(event) => setFilter('sort', event.target.value)}
          >
            <option value="rel">Featured</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
            <option value="rating">Top rated</option>
          </select>
        </div>
      </div>

      {l ? (
        <Loading />
      ) : e ? (
        <ErrorBox msg={e} />
      ) : products.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-[#d8d3e8] bg-white p-10 text-center text-sm text-slate-500">
          No products match. Try clearing a filter or search term.
        </p>
      ) : (
        <>
          <p className="text-xs text-slate-500">
            <span className="font-semibold text-[#28243b]">
              {products.length}
            </span>{' '}
            sample products
          </p>
          <div className="grid grid-cols-2 gap-3 min-[480px]:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
            {products.map((product) => (
              <ProductCard key={product.id} p={product} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export const ProductsPage = () => (
  <ProductList
    title="All products"
    intro="Search, filter and sort the sample catalogue, or open a retailer to explore current listings."
  />
)

export const CategoryPage = () => {
  const { slug = '' } = useParams()
  const category = catOf(slug)

  return category ? (
    <ProductList
      cat={slug}
      title={category.name}
      intro={`Explore ${category.name.toLowerCase()} products and search retailer listings.`}
    />
  ) : (
    <NotFound />
  )
}

export const StorePage = () => {
  const { slug = '' } = useParams()
  const store = storeOf(slug)

  return store ? (
    <ProductList store={slug} title={store.name} intro={store.blurb} />
  ) : (
    <NotFound />
  )
}

export const FestivalPage = () => {
  const { slug = '' } = useParams()
  const festival = festivals.find((item) => item.slug === slug)

  return festival ? (
    <ProductList
      festival={slug}
      title={festival.name}
      intro={`${festival.when}. ${festival.blurb}`}
    />
  ) : (
    <NotFound />
  )
}

export function Home() {
  const { d, l, e } = useAsync(() => provider.getProducts(), [])
  const top = [...(d ?? [])]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10)

  return (
    <div className="space-y-8 sm:space-y-10">
      <section className="relative overflow-hidden rounded-[1.5rem] bg-[#28243b] px-5 py-8 text-white sm:px-8 sm:py-10 lg:px-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full border-[36px] border-white/[0.04]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 right-24 h-48 w-48 rounded-full bg-indigo-500/20 blur-2xl"
        />

        <div className="relative grid items-center gap-7 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-100">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-300" />
              The smarter way to browse
            </span>

            <h1 className="mt-4 max-w-2xl text-3xl font-bold leading-[1.12] tracking-tight sm:text-4xl lg:text-5xl">
              Your festive wishlist.
              <br />
              <span className="text-[#c7c0ff]">One smarter start.</span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-6 text-white/70">
              Discover products, explore festival collections and compare
              shopping options before you buy.
            </p>

            <form
              action="/products"
              className="mt-5 flex max-w-xl gap-2 rounded-2xl bg-white p-1.5"
              role="search"
            >
              <span className="grid place-items-center pl-2 text-slate-400">
                ⌕
              </span>
              <input
                name="q"
                aria-label="Search products"
                placeholder="Search products, brands or gifts…"
                className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm text-[#28243b] outline-none placeholder:text-slate-400"
              />
              <button className="rounded-xl bg-indigo-700 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-600">
                Search
              </button>
            </form>

            <div className="mt-3">
              <p className="text-[11px] text-white/55">
                Search retailers directly
              </p>
              <RetailerSearchLinks query="popular products India" compact />
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="ml-auto max-w-sm rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-200">
                Your shopping shortlist
              </p>

              <div className="mt-4 space-y-3">
                {[
                  ['Everyday essentials', 'Find useful picks'],
                  ['Festival favourites', 'Browse seasonal ideas'],
                  ['Compare with confidence', 'Check retailer listings'],
                ].map(([title, description], index) => (
                  <div
                    key={title}
                    className="flex items-center gap-3 rounded-2xl bg-white/[0.07] p-3"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-indigo-100">
                      0{index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{title}</p>
                      <p className="mt-0.5 text-xs text-white/55">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-[10px] leading-5 text-white/45">
                Catalogue prices are sample data, not live retailer prices.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-2xl border border-[#e8e5df] bg-white p-3.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-50 text-indigo-700">⌕</span>
          <div>
            <p className="text-xs font-semibold">Easy discovery</p>
            <p className="mt-0.5 text-[10px] text-slate-500">Search by product</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-[#e8e5df] bg-white p-3.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-50 text-indigo-700">↗</span>
          <div>
            <p className="text-xs font-semibold">Retailer links</p>
            <p className="mt-0.5 text-[10px] text-slate-500">Check current listings</p>
          </div>
        </div>

        <div className="col-span-2 flex items-center gap-3 rounded-2xl border border-[#e8e5df] bg-white p-3.5 sm:col-span-1">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-50 text-indigo-700">✓</span>
          <div>
            <p className="text-xs font-semibold">Clear disclosures</p>
            <p className="mt-0.5 text-[10px] text-slate-500">Sample prices labelled</p>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-700">
              Plan your next find
            </p>
            <H2>Festivals & shopping events</H2>
          </div>
          <Link
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:underline"
            to="/festivals"
          >
            View all <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {festivals.slice(0, 8).map((festival, index) => (
            <Link
              key={festival.slug}
              to={`/festival/${festival.slug}`}
              className="group rounded-2xl border border-[#e8e5df] bg-white p-3.5 transition hover:border-indigo-200 hover:shadow-sm sm:p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#f4f2ff] text-indigo-700">
                  {['✧', '◈', '◇', '✳'][index % 4]}
                </span>
                <span className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-700">
                  ↗
                </span>
              </div>
              <p className="text-sm font-semibold leading-5 text-[#28243b]">
                {festival.name.replace(/^\S+\s/, '')}
              </p>
              <p className="mt-1 text-[10px] leading-4 text-slate-500">
                {festival.when}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-700">
            Browse your way
          </p>
          <H2>Shop by category</H2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/category/${category.slug}`}
              className="group flex items-center gap-3 rounded-2xl border border-[#e8e5df] bg-white p-3 transition hover:border-indigo-200 hover:shadow-sm sm:flex-col sm:items-start sm:p-4"
            >
              <CategoryIcon slug={category.slug} />
              <span className="text-xs font-semibold text-[#28243b] group-hover:text-indigo-700">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-700">
              Popular in the catalogue
            </p>
            <H2>Top rated picks</H2>
            <p className="mt-1 text-xs text-slate-500">
              Illustrative sample prices · not live offers
            </p>
          </div>
          <Link
            className="text-xs font-semibold text-indigo-700 hover:underline"
            to="/products"
          >
            Browse products →
          </Link>
        </div>

        {l ? (
          <Loading />
        ) : e ? (
          <ErrorBox msg={e} />
        ) : (
          <div className="grid grid-cols-2 gap-3 min-[480px]:grid-cols-3 lg:grid-cols-5">
            {top.map((product) => (
              <ProductCard key={product.id} p={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export function ProductPage() {
  const { id = '' } = useParams()
  const { d: product, l, e } = useAsync(
    () => provider.getProduct(id),
    [id]
  )
  const related = useAsync(() => provider.getProducts(), [])

  if (l) return <Loading />
  if (e) return <ErrorBox msg={e} />
  if (!product) return <NotFound />

  const highestPrice = Math.max(...product.offers.map((offer) => offer.price))

  return (
    <div className="space-y-7">
      <p className="text-xs text-slate-500">
        <Link
          className="font-medium text-indigo-700 hover:underline"
          to={`/category/${product.category}`}
        >
          {catOf(product.category)?.name}
        </Link>
        <span className="mx-2 text-slate-300">/</span>
        {product.name}
      </p>

      <div className="grid gap-5 md:grid-cols-[15rem_1fr] lg:grid-cols-[19rem_1fr]">
        <div
          aria-hidden
          className="grid min-h-52 place-items-center rounded-3xl border border-[#e8e5df] bg-[#f6f4f0] p-6 md:min-h-64"
        >
          <CategoryIcon slug={product.category} />
        </div>

        <div className="rounded-3xl border border-[#e8e5df] bg-white p-5 sm:p-7">
          <div className="flex flex-wrap items-center gap-2">
            <DemoBadge />
            <Stars n={product.rating} />
          </div>

          <div className="mt-3">
            <H1>{product.name}</H1>
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            {product.description}
          </p>

          <p className="mt-4 text-2xl font-bold text-indigo-700">
            From {inr(best(product))}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Sample prices span {inr(highestPrice - best(product))}. These are
            not verified live prices.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {product.festivals.map((festivalSlug) => (
              <Link
                key={festivalSlug}
                to={`/festival/${festivalSlug}`}
                className="rounded-full border border-indigo-100 bg-[#f4f2ff] px-3 py-1.5 text-[11px] font-medium text-indigo-800"
              >
                {festivals
                  .find((item) => item.slug === festivalSlug)
                  ?.name.replace(/^\S+\s/, '')}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <section>
        <div className="mb-3">
          <H2>Compare sample prices</H2>
          <p className="mt-1 text-xs text-slate-500">
            Use retailer search links to check current listings.
          </p>
        </div>
        <PriceTable p={product} />
        <p className="mt-2 text-[11px] text-slate-500">
          Sample prices for illustration only. Not live, verified or guaranteed.
        </p>
      </section>

      <section>
        <div className="mb-3">
          <H2>More in {catOf(product.category)?.name}</H2>
        </div>
        <div className="grid grid-cols-2 gap-3 min-[480px]:grid-cols-3 lg:grid-cols-5">
          {(related.d ?? [])
            .filter(
              (item) =>
                item.category === product.category && item.id !== product.id
            )
            .slice(0, 5)
            .map((item) => (
              <ProductCard key={item.id} p={item} />
            ))}
        </div>
      </section>
    </div>
  )
}

export const Categories = () => (
  <div>
    <div className="mb-5">
      <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-700">
        Find your interests
      </p>
      <H1>Shop by category</H1>
      <p className="mt-2 text-sm text-slate-500">
        Explore the catalogue by product type.
      </p>
    </div>

    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {categories.map((category) => (
        <Link
          key={category.slug}
          to={`/category/${category.slug}`}
          className="group flex items-center gap-3 rounded-2xl border border-[#e8e5df] bg-white p-4 transition hover:border-indigo-200 hover:shadow-sm"
        >
          <CategoryIcon slug={category.slug} />
          <span className="text-sm font-semibold group-hover:text-indigo-700">
            {category.name}
          </span>
        </Link>
      ))}
    </div>
  </div>
)

export const Festivals = () => (
  <div>
    <div className="mb-5">
      <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-700">
        Seasonal inspiration
      </p>
      <H1>Festivals & shopping events</H1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
        Browse festival pages for shopping inspiration and links to external
        retailer searches. These links do not represent verified deals.
      </p>
    </div>

    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {festivals.map((festival, index) => (
        <Link
          key={festival.slug}
          to={`/festival/${festival.slug}`}
          className="group rounded-2xl border border-[#e8e5df] bg-white p-4 transition hover:border-indigo-200 hover:shadow-sm sm:p-5"
        >
          <span className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-[#f4f2ff] text-lg text-indigo-700">
            {['✧', '◈', '◇', '✳'][index % 4]}
          </span>
          <h2 className="text-sm font-semibold leading-5">
            {festival.name.replace(/^\S+\s/, '')}
          </h2>
          <p className="mt-1 text-[10px] text-slate-500">{festival.when}</p>
          <p className="mt-3 text-xs leading-5 text-slate-600">
            {festival.blurb}
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-indigo-700">
            Explore <span>→</span>
          </span>
        </Link>
      ))}
    </div>
  </div>
)

export const Stores = () => (
  <div>
    <div className="mb-5">
      <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-700">
        Retailer directory
      </p>
      <H1>Stores</H1>
      <p className="mt-2 text-sm text-slate-500">
        These store cards belong to the sample catalogue. Use product-page
        search links to explore real retailer listings.
      </p>
    </div>

    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {stores.map((store) => (
        <Link
          key={store.slug}
          to={`/store/${store.slug}`}
          className="flex items-start gap-3 rounded-2xl border border-[#e8e5df] bg-white p-4 transition hover:border-indigo-200 hover:shadow-sm"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-700">
            ↗
          </span>
          <span>
            <span className="block text-sm font-semibold">{store.name}</span>
            <span className="mt-1 block text-xs leading-5 text-slate-500">
              {store.blurb}
            </span>
          </span>
        </Link>
      ))}
    </div>
  </div>
)

export const About = () => (
  <div className="max-w-3xl">
    <div className="mb-5">
      <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-700">
        Transparency first
      </p>
      <H1>About & disclosure</H1>
    </div>

    <div className="space-y-4 rounded-2xl border border-[#e8e5df] bg-white p-5 text-sm leading-7 text-slate-600 sm:p-7">
      <p>
        Festivo Deals is a product-discovery prototype for festivals and
        shopping events around the world.
      </p>

      <ul className="list-disc space-y-2 pl-5">
        <li>
          Every product, store, price, MRP and discount in the comparison
          catalogue is fictional sample data.
        </li>
        <li>
          Nothing here is a live, verified or lowest-price claim. “Lowest
          sample” refers only to the sample numbers.
        </li>
        <li>
          Retailer search buttons open external search pages. They are not
          affiliate links and do not guarantee a specific product, price or
          offer.
        </li>
        <li>
          This version does not claim coupon codes or affiliate partnerships.
        </li>
        <li>
          If affiliate links or live product feeds are added later, they will
          be clearly disclosed and used according to provider terms.
        </li>
      </ul>

      <p>
        The data layer is designed to support legitimate product feeds when
        authorized access becomes available.
      </p>
    </div>
  </div>
)

export const NotFound = () => (
  <div className="grid min-h-[45vh] place-items-center py-16 text-center">
    <div>
      <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-indigo-50 text-indigo-700">
        ⌕
      </span>
      <H1>Page not found</H1>
      <p className="mb-5 mt-2 text-sm text-slate-500">
        That page doesn’t exist or may have moved.
      </p>
      <Link
        className="inline-flex items-center gap-2 rounded-xl bg-indigo-700 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-600"
        to="/"
      >
        Back to home <span>→</span>
      </Link>
    </div>
  </div>
)
