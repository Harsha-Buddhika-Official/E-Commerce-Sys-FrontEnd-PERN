import { Routes, Route } from "react-router-dom";
import Navbar from "../../modules/public/components/Navigation/Navbar.jsx";
import Footer from "../../modules/public/components/Layout/Footer.jsx";
import Home from "../../modules/public/pages/Home.jsx";
import ProductsPage from "../../modules/public/pages/ProductsPage.jsx";
import ProductInfoPage from "../../modules/public/pages/ProductInfoPage.jsx";
import ServicesPage from "../../modules/public/pages/ServicesPage.jsx";
import OffersPage from "../../modules/public/pages/OffersPage.jsx";
import AboutPage from "../../modules/public/pages/AboutPage.jsx";
import ContactPage from "../../modules/public/pages/ContactPage.jsx";

export default function PublicRoutes() {
  // const [selectedCategory, setSelectedCategory] = useState(null);
  return (
    <>
      <Navbar
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductsPage/>} />
        <Route path="/product/:id" element={<ProductInfoPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/offers" element={<OffersPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
      <Footer />
    </>
  );
}