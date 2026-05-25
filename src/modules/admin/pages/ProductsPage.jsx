import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SearchOutlinedIcon            from "@mui/icons-material/SearchOutlined";
import CloseOutlinedIcon             from "@mui/icons-material/CloseOutlined";
import AddOutlinedIcon               from "@mui/icons-material/AddOutlined";
import FilterListOutlinedIcon        from "@mui/icons-material/FilterListOutlined";
import ViewListOutlinedIcon          from "@mui/icons-material/ViewListOutlined";
import GridViewOutlinedIcon          from "@mui/icons-material/GridViewOutlined";
import VisibilityOutlinedIcon        from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon              from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon     from "@mui/icons-material/DeleteOutlineOutlined";
import InventoryOutlinedIcon         from "@mui/icons-material/InventoryOutlined";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowRightIcon        from "@mui/icons-material/KeyboardArrowRight";
import WarningAmberOutlinedIcon      from "@mui/icons-material/WarningAmberOutlined";
import ProductsGrid                  from "../components/product/ProductsGrid";
import { useProducts }               from "../features/products/hooks/useProducts";
import { useDeleteProduct }          from "../features/products/hooks/useDeleteProduct";

const SORA  = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

const LIST_COLUMNS = [
	{ key: "thumb",    width: "6%"  },
	{ key: "name",     width: "28%" },
	{ key: "category", width: "14%" },
	{ key: "stock",    width: "10%" },
	{ key: "price",    width: "16%" },
	{ key: "actions",  width: "26%" },
];

const GRID_PER_PAGE = 10;
const LIST_PER_PAGE = 12;

const deriveCategories = (products) => ["All", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))];

const fmt = (amount) => new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", maximumFractionDigits: 2 }).format(amount ?? 0);

function DeleteModal({ product, onConfirm, onCancel }) {
	if (!product) return null;
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
			<div className="bg-white rounded-2xl p-7 flex flex-col gap-4 w-full" style={{ maxWidth: 380, boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}>
					<div className="flex items-center gap-3">
						<div className="flex items-center justify-center w-10 h-10 rounded-full shrink-0" style={{ backgroundColor: "#fef2f2" }}>
						<WarningAmberOutlinedIcon style={{ fontSize: 20, color: "#e53935" }} />
					</div>
					<h3 style={{ ...SORA, fontSize: 15, fontWeight: 800, color: "#111" }}>Delete Product</h3>
				</div>
				<p style={{ ...INTER, fontSize: 13, color: "#555", lineHeight: 1.7 }}>
					Are you sure you want to delete <strong style={{ color: "#111" }}>&quot;{product.name}&quot;</strong>? This action cannot be undone.
				</p>
				<div className="flex gap-3">
					<button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all cursor-pointer" style={{ ...INTER, fontSize: 13, fontWeight: 600, background: "#fff" }}>Cancel</button>
					<button onClick={() => onConfirm(product)} className="flex-1 py-2.5 rounded-xl text-white transition-all cursor-pointer" style={{ ...INTER, fontSize: 13, fontWeight: 700, background: "#e53935", border: "none" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#c62828"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#e53935"}>Delete</button>
				</div>
			</div>
		</div>
	);
}

const ACTION_STYLES = { ghost: { backgroundColor: "#fff", border: "1px solid #ebebeb", color: "#555" }, dark: { backgroundColor: "#111", border: "1px solid #111", color: "#fff" }, danger: { backgroundColor: "#fef2f2", border: "1px solid #fecaca", color: "#e53935" } };

function ActionBtn({ icon, label, variant = "ghost", onClick }) {
	const s = ACTION_STYLES[variant];
	return <button onClick={onClick} className="flex items-center gap-1.5 transition-all duration-150 cursor-pointer" style={{ ...INTER, fontSize: 11, fontWeight: 700, padding: "5px 10px", borderRadius: 8, ...s }} onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.75"; }} onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}>{icon} {label}</button>;
}

function ProductListRow({ product, onView, onEdit, onDelete }) {
	const inStock = product.stockCount > 0;
	return (
		<tr className="transition-colors duration-100" style={{ borderBottom: "1px solid #f5f5f5" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#fafafa"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
					<td style={{ padding: "12px 16px" }}><div className="flex items-center justify-center rounded-xl overflow-hidden shrink-0" style={{ width: 44, height: 44, backgroundColor: "#f5f5f5", border: "1px solid #ebebeb" }}>{product.image ? <img src={product.image} alt={product.name} className="w-full h-full object-contain p-1" /> : <InventoryOutlinedIcon style={{ fontSize: 20, color: "#ccc" }} />}</div></td>
			<td style={{ padding: "12px 16px", overflow: "hidden", maxWidth: 0 }}><p style={{ ...INTER, fontSize: 13, fontWeight: 700, color: "#111", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{product.name}</p><p style={{ ...INTER, fontSize: 11, color: "#bbb", marginTop: 2 }}>{product.brand}</p></td>
			<td style={{ padding: "12px 16px" }}><span className="px-2.5 py-1 rounded-lg" style={{ ...INTER, fontSize: 11, fontWeight: 700, color: "#555", backgroundColor: "#f5f5f5" }}>{product.category}</span></td>
					<td style={{ padding: "12px 16px" }}><div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: inStock ? "#16a34a" : "#e53935" }} /><span style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#111" }}>{product.stockCount}</span></div></td>
			<td style={{ padding: "12px 16px" }}><span style={{ ...INTER, fontSize: 13, fontWeight: 800, color: "#e53935" }}>{fmt(product.sellingPrice)}</span></td>
			<td style={{ padding: "12px 16px" }}><div className="flex items-center gap-1.5"><ActionBtn icon={<VisibilityOutlinedIcon style={{ fontSize: 13 }} />} label="View" variant="ghost" onClick={() => onView(product)} /><ActionBtn icon={<EditOutlinedIcon style={{ fontSize: 13 }} />} label="Edit" variant="dark" onClick={() => onEdit(product)} /><ActionBtn icon={<DeleteOutlineOutlinedIcon style={{ fontSize: 13 }} />} label="Delete" variant="danger" onClick={() => onDelete(product)} /></div></td>
		</tr>
	);
}

function CategoryChip({ label, active, onClick }) {
	return <button onClick={onClick} className="flex items-center px-4 py-2 rounded-xl border shrink-0 cursor-pointer transition-all whitespace-nowrap" style={{ ...INTER, fontSize: 12, fontWeight: 700, backgroundColor: active ? "#111" : "#fff", color: active ? "#fff" : "#555", borderColor: active ? "#111" : "#e5e5e5" }} onMouseEnter={(e) => { if (!active) { e.currentTarget.style.borderColor = "#aaa"; e.currentTarget.style.backgroundColor = "#f9f9f9"; } }} onMouseLeave={(e) => { if (!active) { e.currentTarget.style.borderColor = "#e5e5e5"; e.currentTarget.style.backgroundColor = "#fff"; } }}>{label}</button>;
}

const ProductsPage = () => {
	const { products: apiProducts, loading, error, refresh } = useProducts();
	const { deleteProduct } = useDeleteProduct();
	const [searchQuery,  setSearchQuery]  = useState("");
	const [category,     setCategory]     = useState("All");
	const [viewMode,     setViewMode]     = useState("grid");
	const [page,         setPage]         = useState(1);
	const [deleteTarget, setDeleteTarget] = useState(null);
	const navigate = useNavigate();
	const products = apiProducts;
	const categories = useMemo(() => deriveCategories(products), [products]);

	const filtered = useMemo(() => {
		const q = searchQuery.trim().toLowerCase();
		return products.filter((p) => {
			const matchCat = category === "All" || p.category === category;
			const matchSearch = !q || [p.name, p.brand, p.category].some((f) => f?.toLowerCase().includes(q));
			return matchCat && matchSearch;
		});
	}, [products, searchQuery, category]);

	const perPage = viewMode === "grid" ? GRID_PER_PAGE : LIST_PER_PAGE;
	const totalPages = Math.ceil(filtered.length / perPage);
	const startIdx = (page - 1) * perPage;
	const paginated = filtered.slice(startIdx, startIdx + perPage);

	const handlePage = (p) => { if (p >= 1 && p <= totalPages) setPage(p); };
	const handleSearch = (v) => { setSearchQuery(v); setPage(1); };
	const handleCategory = (c) => { setCategory(c); setPage(1); };
	const handleViewMode = (m) => { setViewMode(m); setPage(1); };

	const handleView = useCallback((p) => navigate(`/admin/products/${p.id}`), [navigate]);
	const handleEdit = useCallback((p) => navigate(`/admin/products/${p.id}/edit`), [navigate]);
	const handleDelete = useCallback((p) => setDeleteTarget(p), []);
	const handleDeleteConfirm = useCallback(async (p) => { try { await deleteProduct(p.id); setDeleteTarget(null); refresh?.(); } catch (err) { window.alert(err?.message || "Failed to delete product"); } }, [deleteProduct, refresh]);
	const handleAddProduct = useCallback(() => navigate("add"), [navigate]);

	const pageNums = () => { const max = 5; let s = Math.max(1, page - Math.floor(max / 2)); let e = Math.min(totalPages, s + max - 1); if (e - s < max - 1) s = Math.max(1, e - max + 1); return Array.from({ length: e - s + 1 }, (_, i) => s + i); };

	return (
		<main className="h-full overflow-y-auto bg-[#f5f5f5] p-5 lg:p-6">
			<DeleteModal product={deleteTarget} onConfirm={handleDeleteConfirm} onCancel={() => setDeleteTarget(null)} />
			{error && (<div className="mb-5 flex items-center gap-3 px-4 py-3 rounded-xl" style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}><WarningAmberOutlinedIcon style={{ fontSize: 16, color: "#e53935", flexShrink: 0 }} /><p style={{ ...INTER, fontSize: 13, fontWeight: 600, color: "#e53935" }}>{error}</p></div>)}
			<div className="flex items-center justify-between mb-6 flex-wrap gap-3">
				<div><p style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500 }}>Catalogue / Products</p><h1 style={{ ...SORA, fontSize: 20, fontWeight: 900, color: "#111", letterSpacing: "-0.3px" }}>Products</h1></div>
				<button onClick={handleAddProduct} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white transition-all cursor-pointer" style={{ ...SORA, fontSize: 13, fontWeight: 700, backgroundColor: "#111", border: "none" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#222"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#111"}><AddOutlinedIcon style={{ fontSize: 18 }} /> Add Product</button>
			</div>
			<div className="bg-white rounded-2xl p-4 mb-5 flex flex-col gap-3" style={{ border: "1px solid #ebebeb", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
					<div className="flex items-center gap-3">
						<div className="relative flex items-center flex-1" style={{ maxWidth: 320 }}>
							<SearchOutlinedIcon style={{ position: "absolute", left: 14, fontSize: 17, color: "#bbb" }} />
							<input
								type="text"
								value={searchQuery}
								onChange={(e) => handleSearch(e.target.value)}
								placeholder="Search products…"
								className="w-full outline-none transition-all"
								style={{ ...INTER, fontSize: 13, fontWeight: 600, color: "#111", padding: "10px 38px", borderRadius: 12, border: "1.5px solid #ebebeb", backgroundColor: "#f9f9f9" }}
								onFocus={(e) => { e.target.style.borderColor = "#111"; e.target.style.backgroundColor = "#fff"; }}
								onBlur={(e) => { e.target.style.borderColor = "#ebebeb"; e.target.style.backgroundColor = "#f9f9f9"; }}
							/>
							{searchQuery && (
								<button onClick={() => handleSearch("")} className="absolute right-3 flex items-center justify-center w-5 h-5 rounded-md cursor-pointer border-none bg-transparent" style={{ color: "#bbb" }}>
									<CloseOutlinedIcon style={{ fontSize: 14 }} />
								</button>
							)}
						</div>
						<div className="flex-1" />
						<div className="flex items-center rounded-xl overflow-hidden shrink-0" style={{ border: "1.5px solid #ebebeb" }}>
							{[{ mode: "grid", Icon: GridViewOutlinedIcon }, { mode: "list", Icon: ViewListOutlinedIcon }].map(({ mode, Icon }, i) => (
								<button key={mode} onClick={() => handleViewMode(mode)} className="flex items-center justify-center cursor-pointer transition-all" style={{ width: 38, height: 38, backgroundColor: viewMode === mode ? "#111" : "#fff", color: viewMode === mode ? "#fff" : "#bbb", border: "none", borderLeft: i > 0 ? "1.5px solid #ebebeb" : "none" }}>
									<Icon style={{ fontSize: 17 }} />
								</button>
							))}
						</div>
					</div>
					<div className="flex items-center gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
						<div className="flex items-center gap-1.5 shrink-0 mr-1"><FilterListOutlinedIcon style={{ fontSize: 14, color: "#bbb" }} /><span style={{ ...INTER, fontSize: 11, fontWeight: 700, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.07em" }}>Category</span></div>
						{categories.map((c) => (<CategoryChip key={c} label={c} active={category === c} onClick={() => handleCategory(c)} />))}
					</div>
			</div>
			{!loading && (<div className="flex items-center justify-between mb-4"><p style={{ ...INTER, fontSize: 12, fontWeight: 600, color: "#aaa" }}><span style={{ color: "#111", fontWeight: 800 }}>{filtered.length}</span> product{filtered.length !== 1 ? "s" : ""}{searchQuery ? ` for "${searchQuery}"` : ""}{category !== "All" ? ` in ${category}` : ""}</p>{(searchQuery || category !== "All") && (<button onClick={() => { setSearchQuery(""); setCategory("All"); setPage(1); }} className="flex items-center gap-1.5 cursor-pointer border-none bg-transparent" style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#e53935" }}><CloseOutlinedIcon style={{ fontSize: 13 }} /> Clear filters</button>)}</div>)}
			{viewMode === "grid" && (<ProductsGrid products={paginated} loading={loading} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />)}
			{viewMode === "list" && (<div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #ebebeb", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}><div className="overflow-x-auto"><table className="w-full border-collapse" style={{ tableLayout: "fixed", minWidth: 700 }}><colgroup>{LIST_COLUMNS.map((col) => <col key={col.key} style={{ width: col.width }} />)}</colgroup><thead><tr style={{ borderBottom: "1px solid #f0f0f0", backgroundColor: "#fafafa" }}>{["", "Product", "Category", "Stock", "Price", "Actions"].map((h) => (<th key={h} className="text-left" style={{ ...INTER, fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.07em", padding: "12px 16px" }}>{h}</th>))}</tr></thead><tbody>{paginated.length === 0 ? (<tr><td colSpan={6} style={{ textAlign: "center", padding: "64px 16px" }}><div className="flex flex-col items-center gap-3"><div className="flex items-center justify-center w-14 h-14 rounded-2xl" style={{ backgroundColor: "#f5f5f5" }}><InventoryOutlinedIcon style={{ fontSize: 28, color: "#ccc" }} /></div><p style={{ ...INTER, fontSize: 14, color: "#bbb", fontWeight: 600 }}>No products found</p></div></td></tr>) : (paginated.map((p) => <ProductListRow key={p.id} product={p} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />))}</tbody></table></div></div>)}
			{!loading && totalPages > 1 && (<div className="flex items-center justify-between mt-6 flex-wrap gap-3"><p style={{ ...INTER, fontSize: 12, fontWeight: 600, color: "#aaa" }}>Showing <span style={{ color: "#111", fontWeight: 800 }}>{startIdx + 1}–{Math.min(startIdx + perPage, filtered.length)}</span> of <span style={{ color: "#111", fontWeight: 800 }}>{filtered.length}</span></p><div className="flex items-center gap-1.5"><button onClick={() => handlePage(page - 1)} disabled={page === 1} className="flex items-center justify-center w-8 h-8 rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"><KeyboardArrowLeftOutlinedIcon style={{ fontSize: 16 }} /></button>{pageNums().map((n) => (<button key={n} onClick={() => handlePage(n)} className="flex items-center justify-center w-8 h-8 rounded-xl border transition-all cursor-pointer" style={{ ...INTER, fontSize: 12, fontWeight: 700, backgroundColor: page === n ? "#111" : "#fff", borderColor: page === n ? "#111" : "#e5e5e5", color: page === n ? "#fff" : "#555" }}>{n}</button>))}<button onClick={() => handlePage(page + 1)} disabled={page === totalPages} className="flex items-center justify-center w-8 h-8 rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"><KeyboardArrowRightIcon style={{ fontSize: 16 }} /></button></div></div>)}
		</main>
	);
};

export default ProductsPage;
