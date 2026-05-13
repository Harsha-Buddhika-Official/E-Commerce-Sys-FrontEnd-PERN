import { useState, useRef } from "react";
import AddIcon                 from "@mui/icons-material/Add";
import RemoveIcon              from "@mui/icons-material/Remove";
import KeyboardArrowDownIcon   from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon               from "@mui/icons-material/Close";
import InventoryOutlinedIcon   from "@mui/icons-material/InventoryOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";

const SORA  = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

// ─── Reusable Select ──────────────────────────────────────────────────────────
function SelectField({ value, onChange, options, placeholder, blue = false }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none px-4 py-[11px] rounded-xl outline-none transition-all cursor-pointer"
        style={{
          ...INTER, fontSize: 13.5, fontWeight: 500,
          background: blue ? (value ? "#e8f0fe" : "#f0f6ff") : (value ? "#f4f4f4" : "#f9f9f9"),
          color: blue ? (value ? "#1a56db" : "#5a87e8") : (value ? "#1f2937" : "#9ca3af"),
          border: `1.5px solid ${blue ? (value ? "#a4c0f7" : "#c7d9f9") : (value ? "#d1d5db" : "#e5e7eb")}`,
        }}
      >
        <option value="" disabled>{placeholder || "Select…"}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <KeyboardArrowDownIcon style={{
        fontSize: 20,
        color: blue ? "#1a73e8" : "#9ca3af",
        position: "absolute", right: 12, top: "50%",
        transform: "translateY(-50%)", pointerEvents: "none",
      }} />
    </div>
  );
}

// ─── Text Input ───────────────────────────────────────────────────────────────
function TextInput({ value, onChange, placeholder }) {
  return (
    <input
      type="text" value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-[11px] rounded-xl outline-none transition-all"
      style={{
        ...INTER, fontSize: 13.5, fontWeight: 500,
        background: value ? "#e8f0fe" : "#f0f6ff",
        color: value ? "#1a56db" : "#5a87e8",
        border: `1.5px solid ${value ? "#a4c0f7" : "#c7d9f9"}`,
      }}
    />
  );
}

// ─── Price Input ──────────────────────────────────────────────────────────────
function PriceInput({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <input
        type="number" value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-4 pr-14 py-[11px] rounded-xl outline-none transition-all"
        style={{
          ...INTER, fontSize: 13.5, fontWeight: 500,
          background: "#f9f9f9", color: "#1f2937",
          border: `1.5px solid ${value ? "#d1d5db" : "#e5e7eb"}`,
        }}
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2"
        style={{ ...INTER, fontSize: 11.5, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.04em" }}>
        LKR
      </span>
    </div>
  );
}

// ─── Field Label ──────────────────────────────────────────────────────────────
function Label({ children }) {
  return (
    <p className="mb-[7px]" style={{ ...SORA, fontSize: 13, fontWeight: 700, color: "#111827" }}>
      {children}
    </p>
  );
}

// ─── White Card ───────────────────────────────────────────────────────────────
function Card({ children, className = "", style = {} }) {
  return (
    <div
      className={className}
      style={{
        background: "#ffffff",
        borderRadius: 20,
        border: "1px solid #efefef",
        boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// STEP 1
// ──────────────────────────────────────────────────────────────────────────────
function StepOne({ data, onChange, onNext, onCancel }) {
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((f) => URL.createObjectURL(f));
    onChange("images", [...data.images, ...newImages].slice(0, 6));
  };
  const removeImage = (idx) =>
    onChange("images", data.images.filter((_, i) => i !== idx));

  return (
    <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>

      {/* ── COL 1: Thumbnails ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, flexShrink: 0 }}>
        {data.images.map((src, idx) => (
          <Card key={idx} className="relative group overflow-hidden"
            style={{ width: 84, height: 84, borderRadius: 14, padding: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src={src} alt="" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
            <button onClick={() => removeImage(idx)}
              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full bg-red-500 text-white transition-all border-none cursor-pointer"
              style={{ width: 18, height: 18 }}>
              <CloseIcon style={{ fontSize: 11 }} />
            </button>
          </Card>
        ))}
        <button onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center cursor-pointer transition-all"
          style={{
            width: 84, height: 84, borderRadius: 14, flexShrink: 0,
            background: "linear-gradient(135deg,#e8f0fe,#dbeafe)",
            border: "2px dashed #93c5fd",
          }}>
          <AddIcon style={{ fontSize: 28, color: "#1a73e8" }} />
        </button>
        <input ref={fileInputRef} type="file" multiple accept="image/*"
          className="hidden" onChange={handleImageUpload} />
      </div>

      {/* ── COL 2: Main image preview — reduced size ── */}
      <Card style={{ width: 360, height: 480, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: 16, position: "relative" }}>
        {/* Dot grid background */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: 20, opacity: 0.4,
          backgroundImage: "radial-gradient(circle, #e5e7eb 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }} />
        {/* Blue accent corner */}
        <div style={{ position: "absolute", top: 0, left: 0, width: 80, height: 80, borderRadius: "20px 0 60px 0", background: "linear-gradient(135deg,#dbeafe,transparent)", opacity: 0.6 }} />
        <div style={{ position: "absolute", bottom: 0, right: 0, width: 80, height: 80, borderRadius: "60px 0 20px 0", background: "linear-gradient(315deg,#dbeafe,transparent)", opacity: 0.6 }} />

        {data.images.length > 0 ? (
          <img src={data.images[0]} alt="preview"
            style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain", position: "relative", zIndex: 1 }} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, position: "relative", zIndex: 1, cursor: "pointer" }}
            onClick={() => fileInputRef.current?.click()}>
            <div style={{ width: 68, height: 68, borderRadius: 18, background: "#f0f6ff", display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px dashed #93c5fd" }}>
              <InventoryOutlinedIcon style={{ fontSize: 34, color: "#93c5fd" }} />
            </div>
            <p style={{ ...INTER, fontSize: 12, color: "#9ca3af", textAlign: "center" }}>Click to upload<br />product images</p>
          </div>
        )}
      </Card>

      {/* ── COL 3: Details card — highlighted ── */}
      <Card style={{ flex: 1, padding: "26px 26px 22px", display: "flex", flexDirection: "column", gap: 16,
        /* Extra lift for the details panel */
        boxShadow: "0 8px 32px rgba(26,115,232,0.10), 0 2px 8px rgba(0,0,0,0.06)",
        border: "1.5px solid #e0eaff",
      }}>

        {/* Section header bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 14, borderBottom: "1.5px solid #f3f4f6", marginBottom: 2 }}>
          <div style={{ width: 7, height: 26, borderRadius: 4, background: "linear-gradient(180deg,#1a73e8,#1e40af)" }} />
          <span style={{ ...SORA, fontSize: 14, fontWeight: 800, color: "#111827" }}>Product Details</span>
          <div style={{ marginLeft: "auto", background: "#f0f6ff", borderRadius: 8, padding: "3px 10px", border: "1px solid #c7d9f9" }}>
            <span style={{ ...INTER, fontSize: 11, fontWeight: 600, color: "#1a73e8" }}>Step 1 of 2</span>
          </div>
        </div>

        <div>
          <Label>Product Name</Label>
          <TextInput value={data.name} onChange={(v) => onChange("name", v)} placeholder="Enter product name…" />
        </div>

        <div>
          <Label>Description</Label>
          <textarea
            value={data.description}
            onChange={(e) => onChange("description", e.target.value)}
            rows={4}
            placeholder="Product description…"
            className="w-full px-4 py-3 rounded-xl outline-none resize-none transition-all"
            style={{ ...INTER, fontSize: 13, fontWeight: 400, background: "#f9f9f9", color: "#374151", border: "1.5px solid #e5e7eb" }}
          />
        </div>

        <div>
          <Label>Brand</Label>
          <SelectField value={data.brand} onChange={(v) => onChange("brand", v)}
            placeholder="Select brand" blue
            options={["MSI","ASUS","Lenovo","Dell","HP","Acer","Apple","Samsung","Intel","AMD","Nvidia","G.Skill","Corsair","Noctua","LG"]} />
        </div>

        <div>
          <Label>Category</Label>
          <SelectField value={data.category} onChange={(v) => onChange("category", v)}
            placeholder="Select category" blue
            options={["Laptop","Processor","GPU","Memory","Storage","Monitor","Cooling","Motherboard","PSU","Case","Peripherals"]} />
        </div>

        {/* Pricing tinted block */}
        <div style={{ background: "linear-gradient(135deg,#f8faff 0%,#eff6ff 100%)", borderRadius: 14, padding: "14px 14px 12px", border: "1px solid #dbeafe" }}>
          <p style={{ ...SORA, fontSize: 11, fontWeight: 700, color: "#1a73e8", textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 12 }}>
            💰 Pricing
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div>
              <Label>Base Price (Cost per unit)</Label>
              <PriceInput value={data.basePrice} onChange={(v) => onChange("basePrice", v)} placeholder="0.00" />
            </div>
            <div>
              <Label>Selling Price</Label>
              <PriceInput value={data.sellingPrice} onChange={(v) => onChange("sellingPrice", v)} placeholder="0.00" />
            </div>
            <div>
              <Label>Discounted Price</Label>
              <PriceInput value={data.discountedPrice} onChange={(v) => onChange("discountedPrice", v)} placeholder="0.00" />
            </div>
          </div>
        </div>

        {/* Quantity */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Label>Quantity</Label>
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#f0f6ff", borderRadius: 12, padding: "6px 14px", border: "1.5px solid #c7d9f9" }}>
            <button onClick={() => onChange("quantity", Math.max(0, data.quantity - 1))}
              style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 0 }}>
              <RemoveIcon style={{ fontSize: 18, color: "#1a73e8" }} />
            </button>
            <span style={{ ...SORA, fontSize: 17, fontWeight: 800, color: "#1a73e8", minWidth: 28, textAlign: "center" }}>
              {data.quantity}
            </span>
            <button onClick={() => onChange("quantity", data.quantity + 1)}
              style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 0 }}>
              <AddIcon style={{ fontSize: 18, color: "#1a73e8" }} />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 10, borderTop: "1.5px solid #f3f4f6" }}>
          <button onClick={onCancel}
            style={{ ...INTER, fontSize: 13.5, fontWeight: 600, padding: "9px 24px", borderRadius: 10, background: "#fff", color: "#6b7280", border: "1.5px solid #e5e7eb", cursor: "pointer" }}>
            Cancel
          </button>
          <button onClick={onNext}
            style={{ ...INTER, fontSize: 13.5, fontWeight: 700, padding: "9px 28px", borderRadius: 10, color: "#fff", border: "none", cursor: "pointer", background: "linear-gradient(135deg,#1a73e8,#1e40af)", boxShadow: "0 4px 14px rgba(26,115,232,0.35)" }}>
            Next →
          </button>
        </div>
      </Card>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// STEP 2
// ──────────────────────────────────────────────────────────────────────────────
const LEFT_ATTRS = [
  { key: "processor",       label: "Processors",       options: ["Intel Core i3-1215U","Intel Core i5-1335U","Intel Core i7-13620H","Intel Core i7-13700H","Intel Core i9-14900HX","AMD Ryzen 5 7535HS","AMD Ryzen 7 7745HX","AMD Ryzen 9 7945HX"] },
  { key: "graphics",        label: "Graphics",         options: ["Intel Iris Xe Graphics","NVIDIA GeForce RTX 3050 6GB","NVIDIA GeForce RTX 4050 6GB","NVIDIA GeForce RTX 4060 8GB","NVIDIA GeForce RTX 4070 8GB","NVIDIA GeForce RTX 4080 12GB","AMD Radeon RX 7600M"] },
  { key: "storage",         label: "Storage",          options: ["256GB NVMe SSD","512GB NVMe SSD","1TB NVMe SSD","2TB NVMe SSD","512GB + 1TB HDD","1TB SSD + 1TB HDD"] },
  { key: "resolution",      label: "Resolution",       options: ["1920×1080 FHD","2560×1440 QHD","3840×2160 4K","1920×1200 WUXGA"] },
  { key: "batteryLife",     label: "Battery Life",     options: ["41Wh Battery","53.5Wh Battery","72Wh Battery","90Wh Battery","99.9Wh Battery"] },
  { key: "operatingSystem", label: "Operating System", options: ["Windows 11 Home","Windows 11 Pro","FreeDOS","Ubuntu 22.04","macOS Sonoma"] },
  { key: "bluetooth",       label: "Bluetooth",        options: ["Bluetooth 5.0","Bluetooth 5.2","Bluetooth 5.3","Bluetooth 5.4"] },
  { key: "processorFamily", label: "Processor Family", options: ["Intel 12th Gen Core i5","Intel 12th Gen Core i7","Intel 13th Gen Core i7","Intel 13th Gen Core i9","Intel 14th Gen Core i9","AMD Ryzen 5","AMD Ryzen 7","AMD Ryzen 9"] },
  { key: "ram",             label: "Ram",              options: ["8GB DDR4","8GB DDR5","16GB DDR5","32GB DDR5","64GB DDR5"] },
];
const RIGHT_ATTRS = [
  { key: "displaySize",       label: "Display Size",       options: ["13.3 inch","14 inch","15.6 inch","16 inch","17.3 inch"] },
  { key: "refreshRate",       label: "Refresh Rate",       options: ["60Hz","90Hz","120Hz","144Hz","165Hz","240Hz","360Hz"] },
  { key: "weight",            label: "Weight",             options: ["1.38kg","1.6kg","1.8kg","1.98kg","2.2kg","2.5kg"] },
  { key: "keyboardBacklight", label: "Keyboard Backlight", options: ["No Backlight","White Backlit","RGB Backlit Keyboard","Per-key RGB"] },
  { key: "wifiVersion",       label: "Wifi Version",       options: ["WiFi 5","WiFi 6","WiFi 6E","WiFi 7"] },
];

function AttrCard({ title, icon, badge, children }) {
  return (
    <Card style={{ flex: 1, padding: "26px 26px 22px", display: "flex", flexDirection: "column", gap: 16,
      boxShadow: "0 8px 32px rgba(26,115,232,0.09), 0 2px 8px rgba(0,0,0,0.05)",
      border: "1.5px solid #e0eaff",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 14, borderBottom: "1.5px solid #f3f4f6", marginBottom: 4 }}>
        <div style={{ width: 7, height: 26, borderRadius: 4, background: "linear-gradient(180deg,#1a73e8,#1e40af)" }} />
        <span style={{ fontSize: 16 }}>{icon}</span>
        <span style={{ ...SORA, fontSize: 14, fontWeight: 800, color: "#111827" }}>{title}</span>
        <div style={{ marginLeft: "auto", background: "#f0f6ff", borderRadius: 8, padding: "3px 10px", border: "1px solid #c7d9f9" }}>
          <span style={{ ...INTER, fontSize: 11, fontWeight: 600, color: "#1a73e8" }}>{badge}</span>
        </div>
      </div>
      {children}
    </Card>
  );
}

function StepTwo({ data, onChange, onUpload, onCancel }) {
  const sectionStyle = {
    flex: 1,
    padding: "26px 26px 22px",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    boxShadow: "0 8px 32px rgba(26,115,232,0.09), 0 2px 8px rgba(0,0,0,0.05)",
    border: "1.5px solid #e0eaff",
  };

  return (
    <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>

      <Card style={sectionStyle}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {LEFT_ATTRS.map(({ key, label, options }) => (
            <div key={key}>
              <Label>{label}</Label>
              <SelectField value={data[key] || ""} onChange={(v) => onChange(key, v)}
                placeholder={`Select ${label.toLowerCase()}…`} options={options} />
            </div>
          ))}
        </div>
      </Card>

      <Card style={sectionStyle}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {RIGHT_ATTRS.map(({ key, label, options }) => (
            <div key={key}>
              <Label>{label}</Label>
              <SelectField value={data[key] || ""} onChange={(v) => onChange(key, v)}
                placeholder={`Select ${label.toLowerCase()}…`} options={options} />
            </div>
          ))}

          <div>
            <Label>Ports</Label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <SelectField value={data.portsType || ""} onChange={(v) => onChange("portsType", v)}
                placeholder="Select port type…" options={["Standard","Thunderbolt","USB-C only","Other"]} />
              <textarea
                value={data.portsDetail || ""}
                onChange={(e) => onChange("portsDetail", e.target.value)}
                rows={3}
                placeholder="e.g. USB-A, USB-C, HDMI, RJ45…"
                className="w-full px-4 py-3 rounded-xl outline-none resize-none transition-all"
                style={{ ...INTER, fontSize: 13, color: "#374151", background: "#f9f9f9", border: "1.5px solid #e5e7eb" }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 10, borderTop: "1.5px solid #f3f4f6", marginTop: 4 }}>
            <button onClick={onCancel}
              style={{ ...INTER, fontSize: 13.5, fontWeight: 600, padding: "9px 24px", borderRadius: 10, background: "#fff", color: "#6b7280", border: "1.5px solid #e5e7eb", cursor: "pointer" }}>
              Cancel
            </button>
            <button onClick={onUpload}
              style={{ ...INTER, fontSize: 13.5, fontWeight: 700, padding: "9px 28px", borderRadius: 10, color: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 7, background: "linear-gradient(135deg,#1a73e8,#1e40af)", boxShadow: "0 4px 14px rgba(26,115,232,0.35)" }}>
              <CloudUploadOutlinedIcon style={{ fontSize: 16 }} /> Upload
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// ROOT
// ──────────────────────────────────────────────────────────────────────────────
const AddProductPage = ({ onCancel = () => {}, onSuccess = () => {} }) => {
  const [step, setStep] = useState(1);
  const [product, setProduct] = useState({
    images: [], name: "", description: "", brand: "",
    category: "", basePrice: "", sellingPrice: "", discountedPrice: "", quantity: 10,
  });
  const [attrs, setAttrs] = useState({});

  const handleProductChange = (k, v) => setProduct((p) => ({ ...p, [k]: v }));
  const handleAttrsChange   = (k, v) => setAttrs((a) => ({ ...a, [k]: v }));

  const handleNext = () => {
    if (!product.name.trim())  { alert("Please enter a product name."); return; }
    if (!product.brand)        { alert("Please select a brand."); return; }
    if (!product.category)     { alert("Please select a category."); return; }
    if (!product.sellingPrice) { alert("Please enter a selling price."); return; }
    setStep(2);
  };

  const handleUpload = () => {
    onSuccess({ ...product, attributes: attrs });
  };

  return (
    <div style={{ height: "100%", overflowY: "auto", background: "#f4f6fb", padding: "28px 28px 40px" }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ ...SORA, fontSize: 21, fontWeight: 900, color: "#111827", margin: 0, letterSpacing: "-0.3px" }}>
            {step === 1 ? "Add Product" : "Add Product Attributes"}
          </h1>
          <p style={{ ...INTER, fontSize: 12.5, color: "#9ca3af", marginTop: 3 }}>
            {step === 1 ? "Fill in product details and upload images" : "Specify technical specifications"}
          </p>
        </div>

        {/* Step indicator pill */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4, background: "#fff", borderRadius: 14, padding: "5px 8px", border: "1px solid #e5e7eb", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
          {[{ n: 1, label: "Add Product" }, { n: 2, label: "Add Attributes" }].map((s, i, arr) => (
            <div key={s.n} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <button
                onClick={() => s.n < step && setStep(s.n)}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "6px 14px", borderRadius: 10, border: "none",
                  cursor: s.n < step ? "pointer" : "default",
                  background: step === s.n ? "linear-gradient(135deg,#1a73e8,#1e40af)" : "transparent",
                  color: step === s.n ? "#fff" : step > s.n ? "#6b7280" : "#d1d5db",
                  ...INTER, fontSize: 12.5, fontWeight: 700,
                }}
              >
                <span style={{
                  width: 19, height: 19, borderRadius: "50%", fontSize: 10, fontWeight: 800,
                  background: step === s.n ? "rgba(255,255,255,0.2)" : step > s.n ? "#e5e7eb" : "#f3f4f6",
                  color: step === s.n ? "#fff" : step > s.n ? "#374151" : "#d1d5db",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{s.n}</span>
                {s.label}
              </button>
              {i < arr.length - 1 && (
                <div style={{ width: 16, height: 1.5, background: step > 1 ? "#1a73e8" : "#e5e7eb" }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {step === 1 && (
        <StepOne data={product} onChange={handleProductChange} onNext={handleNext} onCancel={onCancel} />
      )}
      {step === 2 && (
        <StepTwo data={attrs} onChange={handleAttrsChange} onUpload={handleUpload} onCancel={() => setStep(1)} />
      )}
    </div>
  );
};

export default AddProductPage;