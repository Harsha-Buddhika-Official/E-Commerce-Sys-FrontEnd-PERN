import { Routes, Route } from "react-router-dom";
import Navbar from "../../modules/public/components/Navigation/Navbar.jsx";
import Footer from "../../modules/public/components/Layout/Footer.jsx";
import Home from "../../modules/public/pages/Home.jsx";
import ProductsPage from "../../modules/public/pages/ProductsPage.jsx";
import ProductInfoPage from "../../modules/public/pages/ProductInfoPage.jsx";
import CartPage from "../../modules/public/pages/CartPage.jsx";
import ServicesPage from "../../modules/public/pages/ServicesPage.jsx";
import OffersPage from "../../modules/public/pages/OffersPage.jsx";
import OfferDetailPage from "../../modules/public/pages/OfferDetailPage.jsx";
import AboutPage from "../../modules/public/pages/AboutPage.jsx";
import ContactPage from "../../modules/public/pages/ContactPage.jsx";
import DirectCheckout from "../../modules/public/pages/DirectCheckout.jsx";
import CartCheckoutPage from "../../modules/public/pages/CartCheckoutPage.jsx";
import TrackOrderPage from "../../modules/public/pages/TrackOrderPage.jsx";
import ComparePage from "../../modules/public/pages/ComparePage.jsx";
import ChatPage from "../../modules/public/pages/ChatPage.jsx";
import CompareBar from "../../modules/public/components/CompareBar.jsx";


export default function PublicRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductsPage/>} />
        <Route path="/product/:id" element={<ProductInfoPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/offers" element={<OffersPage />} />
        <Route path="/offers/:id" element={<OfferDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/checkout-direct" element={<DirectCheckout />} />
        <Route path="/checkout-cart" element={<CartCheckoutPage />} />
        <Route path="/track-order" element={<TrackOrderPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
      <Footer />
      <CompareBar />
    </>
  );
}