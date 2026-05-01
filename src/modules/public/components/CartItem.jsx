import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

/**
 * CartItem — individual product row inside the Cart drawer.
 *
 * Props:
 *  - item: { id, name, price, quantity }
 *  - onIncrease(id)
 *  - onDecrease(id)
 *  - onRemove(id)
 */
export default function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  const lineTotal = (item.price * item.quantity).toLocaleString("en-LK", {
    minimumFractionDigits: 2,
  });

  return (
    <div className="bg-white rounded-3xl border border-[#ebebeb] p-4 flex flex-col gap-2.5 transition-shadow duration-200 hover:shadow-md" style={{padding: '16px 18px'}}>
      {/* Product name */}
      <div className="text-[15px] font-semibold text-gray-950 leading-relaxed font-sora">
        {item.name}
      </div>

      {/* Quantity label + price */}
      <div className="flex justify-between items-center">
        <div className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-px rounded font-sora" style={{padding: '3px 8px'}}>
          Quantity: {item.quantity}
        </div>
        <div className="text-[15px] font-bold text-gray-950 font-sora">
          Rs {lineTotal}
        </div>
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between">
        {/* +/- stepper */}
        <div className="flex items-center gap-1.5">
          <IconButton
            size="small"
            onClick={() => onDecrease(item.id)}
            sx={{
              width: 34,
              height: 34,
              borderRadius: "8px",
              border: "1.5px solid #d1d5db",
              background: "#f9f9f9",
              color: "#333",
              "&:hover": { background: "#111", color: "#fff", borderColor: "#111" },
              transition: "all .18s",
            }}
          >
            <RemoveIcon sx={{ fontSize: 16 }} />
          </IconButton>

          <div className="w-8 text-center text-[14px] font-bold text-gray-950 font-sora">
            {item.quantity}
          </div>

          <IconButton
            size="small"
            onClick={() => onIncrease(item.id)}
            sx={{
              width: 34,
              height: 34,
              borderRadius: "8px",
              border: "1.5px solid #d1d5db",
              background: "#f9f9f9",
              color: "#333",
              "&:hover": { background: "#111", color: "#fff", borderColor: "#111" },
              transition: "all .18s",
            }}
          >
            <AddIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </div>

        {/* Delete */}
        <IconButton
          size="small"
          onClick={() => onRemove(item.id)}
          sx={{
            width: 36,
            height: 36,
            borderRadius: "8px",
            border: "1.5px solid #fca5a5",
            background: "#fff5f5",
            color: "#dc2626",
            "&:hover": { background: "#dc2626", color: "#fff", borderColor: "#dc2626" },
            transition: "all .18s",
          }}
        >
          <DeleteIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </div>
    </div>
  );
}
