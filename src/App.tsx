import { Route, Routes } from 'react-router-dom'
import { Layout } from './ui'
import { About, Categories, CategoryPage, FestivalPage, Festivals, Home, NotFound, ProductPage, ProductsPage, StorePage, Stores } from './pages/pages'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="product/:id" element={<ProductPage />} />
        <Route path="categories" element={<Categories />} />
        <Route path="category/:slug" element={<CategoryPage />} />
        <Route path="festivals" element={<Festivals />} />
        <Route path="festival/:slug" element={<FestivalPage />} />
        <Route path="stores" element={<Stores />} />
        <Route path="store/:slug" element={<StorePage />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
