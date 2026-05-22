import { useNavigate } from "react-router-dom";
import AddOutlinedIcon           from "@mui/icons-material/AddOutlined";
import StorefrontOutlinedIcon    from "@mui/icons-material/StorefrontOutlined";
import BrandCard from "../components/brand/BrandCard.jsx";
import { useBrands } from "../features/brands/hooks/useBrands.js";
import { useDeleteBrand } from "../features/brands/hooks/useDeleteBrand.js";

const SORA  = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

// BRAND MANAGEMENT PAGE
export default function BrandManagementPage() {
  const navigate = useNavigate();
  const { brands, loading, error, refresh } = useBrands();
  const { deleteBrand } = useDeleteBrand();

  const activeCount = brands.reduce((count, brand) => count + (brand.is_active ? 1 : 0), 0);
  const inactiveCount = brands.length - activeCount;

  if (loading) {
    return (
      <div className="h-full overflow-y-auto bg-[#f5f5f5] p-5 lg:p-6">
        <div className="rounded-2xl bg-white p-6" style={{ border: "1px solid #ebebeb", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <p style={{ ...SORA, fontSize: 15, fontWeight: 800, color: "#111" }}>Loading brands...</p>
          <p style={{ ...INTER, fontSize: 13, color: "#bbb", marginTop: 4 }}>Fetching brand data from the API.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full overflow-y-auto bg-[#f5f5f5] p-5 lg:p-6">
        <div className="rounded-2xl bg-white p-6" style={{ border: "1px solid #ebebeb", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <p style={{ ...SORA, fontSize: 15, fontWeight: 800, color: "#dc2626" }}>Unable to load brands</p>
          <p style={{ ...INTER, fontSize: 13, color: "#666", marginTop: 4 }}>{error}</p>
        </div>
      </div>
    );
  }

  const handleDelete = async (brandId) => {
    try {
      await deleteBrand(brandId);
      await refresh();
    } catch (err) {
      alert(`Failed to delete brand. ${err.message}`);
    }
  }

  return (
    <div className="h-full overflow-y-auto bg-[#f5f5f5] p-5 lg:p-6">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <p style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500 }}>Products / Brands</p>
          <h1 style={{ ...SORA, fontSize: 20, fontWeight: 900, color: "#111", letterSpacing: "-0.3px" }}>Brand Management</h1>
        </div>
        <button
          onClick={() => navigate("/admin/brands/create")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white transition-all cursor-pointer"
          style={{ ...SORA, fontSize: 13, fontWeight: 700, backgroundColor: "#111", border: "none" }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#222"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#111"}
        >
          <AddOutlinedIcon style={{ fontSize: 18 }} /> Add Brand
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Brands", value: brands.length,  bg: "#f5f5f5", color: "#111",    icon: <StorefrontOutlinedIcon style={{ fontSize: 20 }} /> },
          { label: "Active",       value: activeCount,    bg: "#f0fdf4", color: "#15803d", icon: <span className="w-3 h-3 rounded-full bg-green-500 block" /> },
          { label: "Inactive",     value: inactiveCount,  bg: "#fef2f2", color: "#dc2626", icon: <span className="w-3 h-3 rounded-full bg-red-500 block" /> },
        ].map(({ label, value, bg, color, icon }) => (
          <div
            key={label}
            className="bg-white rounded-2xl p-5 flex items-center gap-4"
            style={{ border: "1px solid #ebebeb", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
          >
            <div
              className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
              style={{ backgroundColor: bg, color }}
            >
              {icon}
            </div>
            <div>
              <p style={{ ...INTER, fontSize: 11, fontWeight: 600, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</p>
              <p style={{ ...SORA, fontSize: 22, fontWeight: 900, color: "#111" }}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Brand grid ── */}
      {brands.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {brands.map((brand) => (
            <BrandCard
              key={brand.brand_id}
              brand={brand}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div
          className="bg-white rounded-2xl flex flex-col items-center justify-center py-20 gap-4"
          style={{ border: "1px solid #ebebeb", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
        >
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl" style={{ backgroundColor: "#f5f5f5" }}>
            <StorefrontOutlinedIcon style={{ fontSize: 32, color: "#ccc" }} />
          </div>
          <div className="text-center">
            <p style={{ ...SORA, fontSize: 15, fontWeight: 800, color: "#111" }}>No brands yet</p>
            <p style={{ ...INTER, fontSize: 13, color: "#bbb", marginTop: 4 }}>Add your first brand to get started</p>
          </div>
          <button
            onClick={() => navigate("/admin/brands/create")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white cursor-pointer transition-all"
            style={{ ...SORA, fontSize: 13, fontWeight: 700, backgroundColor: "#111", border: "none" }}
          >
            <AddOutlinedIcon style={{ fontSize: 18 }} /> Add Brand
          </button>
        </div>
      )}
    </div>
  );
}