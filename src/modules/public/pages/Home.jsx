import ImageSlider from "../sections/ImageSlider.jsx";
import VideoSection from "../sections/VideoSection.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import Footer from "../components/footer.jsx";

const Home = () => {
  return (
    <div>
      <ImageSlider />
      <VideoSection />
      <ProductGrid title="Best Sellers" section="best-sellers" />
      <ProductGrid title="Latest Products" section="latest" />
      <Footer />
    </div>
  );
};

export default Home;
