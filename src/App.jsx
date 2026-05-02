import { Routes, Route } from 'react-router-dom'
import Footer from './modules/public/components/footer.jsx'
import UserNavbar from './modules/public/components/UserNavbar.jsx'
import Home from './modules/public/pages/Home.jsx'
import ProductInfoPage from './modules/public/pages/ProductInfoPage.jsx'
import ProductsPage from './modules/public/pages/ProductsPage.jsx'
import ServicesPage from './modules/public/pages/ServicesPage.jsx'
import OffersPage from './modules/public/pages/OffersPage.jsx'

function App() {
  return (
    <>
      <UserNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductInfoPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/offers" element={<OffersPage />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
