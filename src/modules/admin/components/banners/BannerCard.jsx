import VisibilityOutlinedIcon    from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ImageOutlinedIcon         from "@mui/icons-material/ImageOutlined";
import VideocamOutlinedIcon      from "@mui/icons-material/VideocamOutlined";

import { SORA, INTER }           from "../../../../styles/fonts";

export default function BannerCard({ banner, onView, onDelete, canDelete = false }) {
  const { banner_id, title, media_url, media_type } = banner;

  const isVideo = media_type === "video";

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5"
      style={{
        border: "1px solid #ebebeb",
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
      }}
    >
      {/* ── Media ── */}
      <div
        className="relative w-full flex items-center justify-center overflow-hidden"
        style={{ height: 180, backgroundColor: "#f7f7f7", borderBottom: "1px solid #f0f0f0" }}
      >
        {media_url ? (
          isVideo ? (
            <video
              src={media_url}
              className="w-full h-full object-cover"
              muted
              playsInline
              loop
              autoPlay
            />
          ) : (
            <img
              src={media_url}
              alt={title}
              className="w-full h-full object-cover"
            />
          )
        ) : (
          <div className="flex flex-col items-center gap-2">
            {isVideo
              ? <VideocamOutlinedIcon style={{ fontSize: 36, color: "#ddd" }} />
              : <ImageOutlinedIcon   style={{ fontSize: 36, color: "#ddd" }} />
            }
            <span style={{ ...INTER, fontSize: 11, color: "#ccc", fontWeight: 600 }}>
              No {isVideo ? "Video" : "Image"}
            </span>
          </div>
        )}

        {/* Media type badge */}
        {media_url && (
          <div
            className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-1 rounded-lg"
            style={{
              backgroundColor: isVideo ? "rgba(37,99,235,0.85)" : "rgba(0,0,0,0.45)",
              backdropFilter: "blur(4px)",
            }}
          >
            {isVideo
              ? <VideocamOutlinedIcon style={{ fontSize: 11, color: "#fff" }} />
              : <ImageOutlinedIcon   style={{ fontSize: 11, color: "#fff" }} />
            }
            <span style={{ ...INTER, fontSize: 10, fontWeight: 700, color: "#fff" }}>
              {isVideo ? "Video" : "Image"}
            </span>
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col gap-4 p-5 flex-1">
        {/* Title */}
        <h3
          className="line-clamp-2"
          style={{ ...SORA, fontSize: 14, fontWeight: 800, color: "#111", lineHeight: 1.4, letterSpacing: "-0.2px" }}
        >
          {title || "Untitled Banner"}
        </h3>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-auto">
          {/* View */}
          <button
            onClick={() => onView(banner_id)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl cursor-pointer transition-all flex-1 justify-center"
            style={{
              ...INTER, fontSize: 12, fontWeight: 700,
              backgroundColor: "#f5f5f5", color: "#555",
              border: "1px solid #e8e8e8",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#ebebeb"; e.currentTarget.style.color = "#111"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#f5f5f5"; e.currentTarget.style.color = "#555"; }}
          >
            <VisibilityOutlinedIcon style={{ fontSize: 14 }} />
            View
          </button>

          {/* Delete */}

          {canDelete && (
            <button
              onClick={() => onDelete(banner)}
              className="flex items-center justify-center w-9 h-9 rounded-xl cursor-pointer transition-all shrink-0"
              style={{
                backgroundColor: "#fff5f5", color: "#e53935",
                border: "1px solid #fecaca",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#fee2e2"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#fff5f5"; }}
            >
              <DeleteOutlineOutlinedIcon style={{ fontSize: 16 }} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}