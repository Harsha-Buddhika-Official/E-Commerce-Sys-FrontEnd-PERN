import { Link } from "react-router-dom";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";

export default function TrackOrderButton() {
  return (
    <Link
      to="/track-order"
      className="
        fixed bottom-6 right-6 z-40
        flex items-center gap-2
        rounded-full
        bg-zinc-900 text-white
        px-5 py-3
        shadow-lg
        border border-zinc-700
        transition-all duration-200
        hover:bg-zinc-800
        hover:border-zinc-600
        hover:scale-105
        active:scale-95
      "
      aria-label="Track your order"
    >
      <LocalShippingOutlinedIcon fontSize="small" />

      <span className="text-sm font-medium whitespace-nowrap">
        Track Order
      </span>
    </Link>
  );
}