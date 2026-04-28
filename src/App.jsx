import UserNavbar from "./Shared/Components/navbar/UserNavbar.jsx"
import ProductCard from "./components/ProductCard.jsx"
import ImageSlider from "./Shared/Components/slider/ImageSlider.jsx"

function App() {
  return (
    <>
      <UserNavbar />
      <ImageSlider />
      <div className="max-w-[1920px] mx-auto px-4 md:px-8 lg:px-12 py-8">
        <h1 className="text-2xl font-bold mb-6">Featured Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <ProductCard
            image="https://storage-asset.msi.com/global/picture/image/feature/nb/Cyborg15-A13V/images/cyborg-gpu-laptop.png"
            title="MSI Cyborg 15 A13VF"
            specs={["Intel® Core™ i7-13620H", "GeForce RTX™ 4060", "15.6-inch Full HD IPS 144Hz", "16GB DDR5", "1TB NVMeF"]}
            price="Rs. 199,000.00"
            inStock={true}
            badge="New"
            onAddToCart={() => alert("Added to cart!")}
            category="Laptops"
          />
        </div>
      </div>
    </>
  )
}

export default App
