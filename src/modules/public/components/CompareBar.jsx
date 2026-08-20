// src/modules/public/components/CompareBar.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CompareArrows,
  ExpandMore,
  ExpandLess,
//   DeleteOutline,
} from "@mui/icons-material";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useComparison } from "../features/comparison/hooks/useComparison.js";

const FALLBACK_IMAGE = "https://placehold.co/80x80/efefef/333333?text=No+Image";

export default function CompareBar() {
  const navigate = useNavigate();
  const { list, count, remove, clear } = useComparison();
  const [expanded, setExpanded] = useState(false);

  if (count === 0) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-4"
      style={{ fontFamily: "'Sora', 'Segoe UI', sans-serif" }}
    >
      <div className="w-full max-w-180 overflow-hidden rounded-xl bg-zinc-900 shadow-[0_-4px_20px_rgba(0,0,0,0.35)]">
        {/* Expanded product list */}
        {expanded && (
          <div className="max-h-70 overflow-y-auto border-b border-zinc-700 p-3">
            <div className="flex flex-col gap-2">
              {list.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-3 rounded-lg bg-zinc-800 p-2"
                >
                  <img
                    src={item.image || FALLBACK_IMAGE}
                    alt={item.name}
                    className="h-10 w-10 shrink-0 rounded bg-white object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-white">{item.name}</p>
                    {item.price && <p className="text-[11px] text-zinc-400">{item.price}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(item.productId)}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-red-500"
                    aria-label={`Remove ${item.name}`}
                  >
                    <DeleteOutlineOutlinedIcon style={{ fontSize: 16 }} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Control bar */}
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="flex items-center gap-2 text-white"
          >
            <CompareArrows fontSize="small" className="text-red-500" />
            <span className="text-xs font-semibold">
              {count} product{count > 1 ? "s" : ""} selected
            </span>
            {expanded ? (
              <ExpandLess fontSize="small" className="text-zinc-400" />
            ) : (
              <ExpandMore fontSize="small" className="text-zinc-400" />
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={clear}
              className="rounded-md px-3 py-1.5 text-[11px] font-semibold text-zinc-400 transition-colors hover:text-red-500"
            >
              Clear
            </button>
            <button
              type="button"
              disabled={count < 2}
              onClick={() => navigate("/compare")}
              className="rounded-md bg-red-600 px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Compare Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}