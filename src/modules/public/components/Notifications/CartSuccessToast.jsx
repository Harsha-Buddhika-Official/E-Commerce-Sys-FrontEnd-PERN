import { useEffect, useRef, useState } from "react";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

const AUTO_CLOSE_MS = 3500;
const DEFAULT_MESSAGE = "Product added to your cart";

export default function CartSuccessToast() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const [animateKey, setAnimateKey] = useState(0);

  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleAdded = (event) => {
      setMessage(event.detail?.message || DEFAULT_MESSAGE);

      // retrigger animation for rapid-fire adds
      setAnimateKey((prev) => prev + 1);

      setVisible(true);

      clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        setVisible(false);
      }, AUTO_CLOSE_MS);
    };

    window.addEventListener("cart:item-added", handleAdded);

    return () => {
      window.removeEventListener("cart:item-added", handleAdded);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`fixed bottom-5 right-5 z-[80] w-[calc(100vw-2rem)] max-w-sm rounded-2xl border border-zinc-200 bg-white shadow-[0_18px_48px_rgba(0,0,0,0.18)] transition-all duration-300 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <div
        key={animateKey}
        className="flex items-start gap-3 p-4 animate-[toast-bump_250ms_ease]"
      >
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white">
          <ShoppingCartOutlinedIcon fontSize="small" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-zinc-900">
            {message}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Your cart was updated successfully.
          </p>
        </div>
      </div>
    </div>
  );
}