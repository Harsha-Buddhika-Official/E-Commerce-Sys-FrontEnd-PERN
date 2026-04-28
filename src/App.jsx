import UserNavbar from "./components/UserNavbar"
import ProductCard from "./components/ProductCard"

function App() {
  return (
    <>
      <UserNavbar />
      <div className="max-w-[1920px] mx-auto px-4 md:px-8 lg:px-12 py-8">
        <h1 className="text-2xl font-bold mb-6">Featured Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <ProductCard
            image="https://via.placeholder.com/300x200"
            title="Product 1"
            specs={["Spec 1", "Spec 2", "Spec 3"]}
            price="$99.99"
            inStock={true}
            badge="New"
            onAddToCart={() => alert("Added to cart!")}
          />
          <ProductCard
            image="https://via.placeholder.com/300x200"
            title="Product 2"
            specs={["Spec A", "Spec B", "Spec C"]}
            price="$149.99"
            inStock={false}
            badge="Best Seller"
            onAddToCart={() => alert("Added to cart!")}
          />
        </div>
      </div>
    </>
  )
}

export default App
