import ImageSlider from "../sections/ImageSlider.jsx";
import VideoSection from "../sections/VideoSection.jsx";
import ProductGrid from "../components/Product/ProductGrid.jsx";
import { useHomepage} from "../features/products/hooks/useHomepage.js";

const Home = () => {
  const { bestSellers, latestProducts, loading, error } = useHomepage();
  return (
    <div>
      <ImageSlider />
      <VideoSection />
      <ProductGrid title="Best Sellers" products={bestSellers} loading={loading} error={error} />
      <ProductGrid title="Latest Products" products={latestProducts} loading={loading} error={error} />
      
    </div>
  );
};

export default Home;
