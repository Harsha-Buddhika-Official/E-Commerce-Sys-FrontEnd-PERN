import ImageSlider from "../sections/ImageSlider.jsx";
import VideoSection from "../sections/VideoSection.jsx";
import HomepageProductGrid from "../components/Product/HomepageProductGrid.jsx";
import TrackOrderButton from "../components/TrackOrderButton.jsx";

import { useHomepage } from "../features/products/hooks/useHomepage.js";

const Home = () => {
  const {bestSellers,latestProducts,loading,error,} = useHomepage();

  return (
    <div>
      <ImageSlider />

      <VideoSection />

      <HomepageProductGrid
        title="Best Sellers"
        products={bestSellers}
        loading={loading}
        error={error}
      />

      <HomepageProductGrid
        title="Latest Products"
        products={latestProducts}
        loading={loading}
        error={error}
      />

      <TrackOrderButton />
    </div>
  );
};

export default Home;