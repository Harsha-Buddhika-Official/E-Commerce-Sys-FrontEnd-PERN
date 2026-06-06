import { useNavigate, useParams } from "react-router-dom";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import { useBannerDetail } from "../../features/banners/hooks/useBannerDetail.js";
import { SORA, INTER } from "../../../../styles/fonts";

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function InfoRow({ label, value, children }) {
  return (
    <div
      className="flex items-start justify-between gap-4 py-2.5"
      style={{ borderBottom: "1px solid #f8f8f8" }}
    >
      <span
        style={{
          ...INTER,
          fontSize: 12,
          fontWeight: 600,
          color: "#aaa",
          minWidth: 130,
        }}
      >
        {label}
      </span>
      <div className="text-right min-w-0">
        {children || (
          <span
            style={{ ...INTER, fontSize: 13, fontWeight: 600, color: "#111" }}
          >
            {value ?? "—"}
          </span>
        )}
      </div>
    </div>
  );
}

function ViewSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div
        className="w-full rounded-2xl animate-pulse"
        style={{ height: 300, backgroundColor: "#e8e8e8" }}
      />
      <div
        className="bg-white rounded-2xl p-6"
        style={{ border: "1px solid #ebebeb" }}
      >
        <div className="flex flex-col gap-3">
          {[70, 50, 60, 55, 65].map((w, i) => (
            <div
              key={i}
              className="h-4 rounded-lg animate-pulse"
              style={{ width: `${w}%`, backgroundColor: "#f0f0f0" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ViewBannerPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { banner, loading, error } = useBannerDetail(id);

  const cardStyle = {
    border: "1px solid #ebebeb",
    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
  };

  return (
    <div className="h-full overflow-y-auto bg-[#f5f5f5] p-5 lg:p-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/admin/banners")}
          className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-all cursor-pointer"
        >
          <ArrowBackOutlinedIcon style={{ fontSize: 18 }} />
        </button>

        <div>
          <p style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500 }}>
            Banners / View
          </p>
          <h1 style={{ ...SORA, fontSize: 20, fontWeight: 900, color: "#111" }}>
            Banner Details
          </h1>
        </div>
      </div>

      <div className="w-full max-w-6xl">
        {loading && <ViewSkeleton />}

        {!loading && (error || !banner) && (
          <div className="bg-white rounded-2xl px-6 py-5" style={cardStyle}>
            <p
              style={{ ...SORA, fontSize: 15, fontWeight: 800, color: "#111" }}
            >
              Banner not found
            </p>
            <p style={{ ...INTER, fontSize: 13, color: "#777", marginTop: 4 }}>
              {error || "This banner could not be loaded."}
            </p>

            <button
              onClick={() => navigate("/admin/banners")}
              className="mt-4 px-4 py-2.5 rounded-xl text-white cursor-pointer"
              style={{
                ...SORA,
                fontSize: 13,
                fontWeight: 700,
                backgroundColor: "#111",
              }}
            >
              Go Back
            </button>
          </div>
        )}

        {!loading && banner && (
          <div className="flex flex-col gap-5">
            <div
              className="w-full overflow-hidden rounded-2xl"
              style={{border: "1px solid #f0f0f0",backgroundColor: "#f7f7f7",}}
            >
              <img src={banner.media_url} alt={banner.title} className="block"
                style={{maxWidth: "100%",maxHeight: "70vh",width: "auto",height: "auto",objectFit: "contain",}}
              />
            </div>

            <div className="bg-white rounded-2xl p-6" style={cardStyle}>
              <div
                className="mb-5 pb-4"
                style={{ borderBottom: "1px solid #f0f0f0" }}
              >
                <h2
                  style={{
                    ...SORA,
                    fontSize: 20,
                    fontWeight: 900,
                    color: "#111",
                  }}
                >
                  {banner.title}
                </h2>
              </div>

              <InfoRow label="Banner Title" value={banner.title} />

              <InfoRow label="Created">
                <span
                  className="flex items-center gap-1.5"
                  style={{
                    ...INTER,
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#555",
                  }}
                >
                  <CalendarTodayOutlinedIcon
                    style={{ fontSize: 13, color: "#bbb" }}
                  />
                  {formatDate(banner.created_at)}
                </span>
              </InfoRow>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
