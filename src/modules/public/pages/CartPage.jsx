import { useNavigate } from "react-router-dom";
import Cart from "../components/Cart/Cart.jsx";

export default function CartPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-100">
      <Cart open onClose={() => navigate(-1)} />
    </div>
  );
}