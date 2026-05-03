import { useState } from "react";
import { IconButton, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import CartItem from "./CartItem";

// ─── Demo initial state ───────────────────────────────────────────────────────
const INITIAL_ITEMS = [
  {
    id: 1,
    name: "HAVIT H2002D Gaming series-Gaming Headphone Black",
    price: 10000,
    quantity: 1,
  },
  {
    id: 2,
    name: "HAVIT H2002D Gaming series-Gaming Headphone Black",
    price: 10000,
    quantity: 1,
  },
];

// ─── Cart Drawer ──────────────────────────────────────────────────────────────
/**
 * Cart
 *
 * Props:
 *  - open (bool)        – controlled open state
 *  - onClose (fn)       – called when overlay or × is clicked
 *
 * Or use it standalone (no props) — it manages its own open state via the
 * floating cart button rendered inside this component for demo purposes.
 */
export default function Cart({ open: openProp, onClose: onCloseProp }) {
  // If used standalone (no props), manage own state
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;
  const handleClose = isControlled ? onCloseProp : () => setInternalOpen(false);

  const [items, setItems] = useState(INITIAL_ITEMS);

  const increase = (id) =>
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i))
    );

  const decrease = (id) =>
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i
      )
    );

  const remove = (id) => setItems((prev) => prev.filter((i) => i.id !== id));

  const clearAll = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <>
      {/* ── Standalone trigger button (only when uncontrolled) ── */}
      {!isControlled && (
        <div className="fixed top-4 right-4 z-50">
          <IconButton
            onClick={() => setInternalOpen(true)}
            className="!w-12 !h-12 !bg-gray-950 !text-white !rounded-xl shadow-xl hover:!bg-gray-800"
          >
            <ShoppingCartOutlinedIcon />
          </IconButton>
          {items.length > 0 && (
            <div className="absolute top-0 right-0 w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center -translate-y-2.5 translate-x-2.5 pointer-events-none font-sora">
              {items.reduce((s, i) => s + i.quantity, 0)}
            </div>
          )}
        </div>
      )}

      {/* ── Backdrop overlay ── */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 z-40 bg-black/70 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        } ${open ? "backdrop-blur-sm" : ""}`}
      />

      {/* ── Cart Drawer ── */}
      <div
        className={`fixed top-0 right-0 h-screen w-full sm:w-96 z-50 bg-gray-100 flex flex-col shadow-2xl font-sora transition-transform duration-350 ${open ? "translate-x-0" : "translate-x-full"}`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h1 className="text-[26px] font-extrabold text-gray-950 tracking-tighter">
            Cart
          </h1>
          <IconButton
            onClick={handleClose}
            size="small"
            className="!bg-gray-300 !rounded-lg !text-gray-700 hover:!bg-gray-950 hover:!text-white transition-all duration-200"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-2.5 pb-2 flex flex-col gap-1.5 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-gray-400 mt-20">
              <ShoppingCartOutlinedIcon sx={{ fontSize: 56, color: "#d1d5db" }} />
              <div className="text-[15px] font-semibold text-gray-600">
                Your cart is empty
              </div>
            </div>
          ) : (
            items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onIncrease={increase}
                onDecrease={decrease}
                onRemove={remove}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-2.5 pb-3 pt-1 bg-gray-100 border-t border-gray-300">
          {/* Total row */}
          <div className="flex justify-between items-baseline py-3">
            <div className="text-base font-bold text-gray-950">Total:</div>
            <div className="text-[22px] font-extrabold text-gray-950 tracking-tighter">
              {total.toLocaleString("en-LK", { minimumFractionDigits: 2 })}
            </div>
          </div>

          <Divider sx={{ mb: 2, borderColor: "#d0d0d0" }} />

          {/* Checkout + Clear row */}
          <div className="flex gap-1.5 items-center">
            <button
              disabled={items.length === 0}
              className={`flex-1 py-3.5 px-4 border-none rounded-xl font-bold text-[15px] tracking-wide font-sora transition-all duration-200 flex items-center justify-center ${
                items.length === 0
                  ? "bg-gray-300 text-white cursor-not-allowed"
                  : "bg-gray-950 text-white hover:bg-gray-800 active:translate-y-0.5"
              }`}
            >
              Checkout
            </button>

            {/* Clear all */}
            <IconButton
              onClick={clearAll}
              disabled={items.length === 0}
              sx={{
                width: 48,
                height: 48,
                borderRadius: "10px",
                border: "1.5px solid #d1d5db",
                background: "#fff",
                color: "#555",
                "&:hover:not(:disabled)": {
                  background: "#dc2626",
                  color: "#fff",
                  borderColor: "#dc2626",
                },
                "&:disabled": { opacity: 0.4 },
                transition: "all .18s",
              }}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        </div>
      </div>

      {/* Font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');`}</style>
    </>
  );
}
