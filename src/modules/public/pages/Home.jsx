import ProductCard from "../components/ProductCard.jsx";
import ImageSlider from "../sections/ImageSlider.jsx";
import VideoSection from "../sections/VideoSection.jsx";

const Home = () => {
  return (
    <div>
    <ImageSlider />
    <VideoSection />
      <div className="max-w-[1920px] mx-auto px-4 md:px-8 lg:px-80 py-8">
        <h1 className="text-center font-semibold mb-6" style={{ fontSize: '60px', fontFamily: 'Inter, sans-serif' }}>Best Sellers</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <ProductCard
            image="https://storage-asset.msi.com/global/picture/image/feature/nb/Cyborg15-A13V/images/cyborg-gpu-laptop.png"
            title="MSI Cyborg 15 A13VF"
            specs={[
              "Intel® Core™ i7-13620H",
              "GeForce RTX™ 4060",
              "15.6-inch Full HD IPS 144Hz",
              "16GB DDR5",
              "1TB NVMeF",
            ]}
            price="Rs. 199,000.00"
            inStock={true}
            badge="Best Seller"
            onAddToCart={() => alert("Added to cart!")}
            category="Laptops"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
