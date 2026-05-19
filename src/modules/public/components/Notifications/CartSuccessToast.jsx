import { useEffect, useState } from "react";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

const AUTO_CLOSE_MS = 3500;

export default function CartSuccessToast() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("Product added to your cart");

  useEffect(() => {
    let timeoutId;

    const handleAdded = (event) => {
      setMessage(event.detail?.message || "Product added to your cart");
      setVisible(true);

      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }

      timeoutId = window.setTimeout(() => {
        setVisible(false);
      }, AUTO_CLOSE_MS);
    };

    window.addEventListener("cart:item-added", handleAdded);

    return () => {
      window.removeEventListener("cart:item-added", handleAdded);
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-5 right-5 w-[calc(100vw-2rem)] max-w-sm rounded-2xl border border-zinc-200 bg-white shadow-[0_18px_48px_rgba(0,0,0,0.18)]"
      style={{ zIndex: 80 }}
    >
      <div className="flex items-start gap-3 p-4">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white">
          <ShoppingCartOutlinedIcon fontSize="small" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-zinc-900">{message}</p>
          <p className="mt-1 text-xs text-zinc-500">Your cart was updated successfully.</p>
        </div>
      </div>
    </div>
  );
}