import { useState, useRef, useEffect }   from "react";
import { SORA, INTER }                   from "../../../styles/fonts.js";

import ShoppingCartOutlinedIcon          from "@mui/icons-material/ShoppingCartOutlined";
import PersonOutlinedIcon                from "@mui/icons-material/PersonOutlined";
import EmailOutlinedIcon                 from "@mui/icons-material/EmailOutlined";
import LocalPhoneOutlinedIcon            from "@mui/icons-material/LocalPhoneOutlined";
import LocationOnOutlinedIcon            from "@mui/icons-material/LocationOnOutlined";
import LocationCityOutlinedIcon          from "@mui/icons-material/LocationCityOutlined";
import MarkunreadMailboxOutlinedIcon     from "@mui/icons-material/MarkunreadMailboxOutlined";
import CheckCircleOutlinedIcon           from "@mui/icons-material/CheckCircleOutlined";
import WarningAmberOutlinedIcon          from "@mui/icons-material/WarningAmberOutlined";
import SendOutlinedIcon                  from "@mui/icons-material/SendOutlined";
import CloseIcon                         from "@mui/icons-material/Close";
import InventoryOutlinedIcon             from "@mui/icons-material/InventoryOutlined";
import CloudUploadOutlinedIcon           from "@mui/icons-material/CloudUploadOutlined";
import InsertDriveFileOutlinedIcon       from "@mui/icons-material/InsertDriveFileOutlined";
import ReceiptLongOutlinedIcon           from "@mui/icons-material/ReceiptLongOutlined";

import { useCart }           from "../features/cart/hooks/useCart.js";
import { useCreateOrder }    from "../features/orders/hooks/useCreateOrder.js";
import { useUploadReceipt }  from "../features/orders/hooks/useUploadReceipt.js";
import OrderSuccessScreen    from "../components/order/OrderSuccessScreen.jsx";

function formatLKR(amount) {
  return `LKR ${Number(amount).toLocaleString("en-LK", { minimumFractionDigits: 2 })}`;
}

const SHIPPING_THRESHOLD = 50000;
const SHIPPING_FEE       = 500;
const ALLOWED_TYPES      = ["image/jpeg", "application/pdf"];
const ALLOWED_LABEL      = "JPG / JPEG or PDF";

function SectionCard({ title, subtitle, icon, children }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #ebebeb", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
      <div className="flex items-center gap-3 px-6 py-4" style={{ borderBottom: "1px solid #f0f0f0" }}>
        <div className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0" style={{ backgroundColor: "#111" }}>{icon}</div>
        <div>
          {subtitle && <p style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500 }}>{subtitle}</p>}
          <h2 style={{ ...SORA, fontSize: 15, fontWeight: 900, color: "#111", letterSpacing: "-0.2px" }}>{title}</h2>
        </div>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function FieldLabel({ children, required }) {
  return (
    <p style={{ ...INTER, fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>
      {children}{required && <span style={{ color: "#e53935" }}> *</span>}
    </p>
  );
}

function TextInput({ value, onChange, placeholder, icon, error, type = "text" }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative flex items-center">
      {icon && (
        <div className="absolute left-3 pointer-events-none flex items-center" style={{ color: focused ? "#111" : "#bbb", transition: "color 0.15s" }}>
          {icon}
        </div>
      )}
      <input
        type={type} value={value} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder}
        className="w-full outline-none transition-all"
        style={{
          ...INTER, fontSize: 13, fontWeight: 600, color: "#111",
          padding: `11px 14px 11px ${icon ? "40px" : "14px"}`, borderRadius: 12,
          border: `1.5px solid ${error ? "#e53935" : focused ? "#111" : "#ebebeb"}`,
          backgroundColor: focused ? "#fff" : "#f9f9f9",
          transition: "border-color 0.15s, background-color 0.15s",
        }}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      />
    </div>
  );
}

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1 mt-1.5" style={{ ...INTER, fontSize: 11, color: "#e53935" }}>
      <WarningAmberOutlinedIcon style={{ fontSize: 12 }} /> {message}
    </p>
  );
}

export default function CartCheckoutPage() {
  const fileRef = useRef();
  const { items, total, itemCount }                = useCart();
  const { createOrder, loading, error: hookError } = useCreateOrder();
  const { uploadReceipt, loading: uploadLoading, error: uploadHookError } = useUploadReceipt();

  const shipping   = total >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const grandTotal = total + shipping;

  const [form,         setForm]         = useState({ name: "", email: "", phone: "", address: "", city: "", postal: "" });
  const [receiptFiles, setReceiptFiles] = useState([]);
  const [uploadErr,    setUploadErr]    = useState("");
  const [errors,       setErrors]       = useState({});
  const [apiError,     setApiError]     = useState("");
  const [orderResult,  setOrderResult]  = useState(null);

  useEffect(() => {
    if (hookError) setApiError(hookError?.message || "Failed to place order. Please try again.");
  }, [hookError]);

  useEffect(() => {
    return () => receiptFiles.forEach(({ preview }) => preview && URL.revokeObjectURL(preview));
  }, []);

  useEffect(() => {
    if (uploadHookError) setApiError(uploadHookError?.message || "Order placed, but receipt upload failed. Please contact support.");
  }, [uploadHookError]);

  const setField = (key) => (val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => { const n = { ...e }; delete n[key]; return n; });
    setApiError("");
  };

  const handleFiles = (incoming) => {
    setUploadErr("");
    const maxSize = 10 * 1024 * 1024;
    const valid = [];
    for (const file of Array.from(incoming)) {
      if (!ALLOWED_TYPES.includes(file.type)) { setUploadErr(`Only ${ALLOWED_LABEL} files are allowed.`); return; }
      if (file.size > maxSize)                { setUploadErr(`"${file.name}" exceeds the 10 MB limit.`); return; }
      valid.push(file);
    }
    const file = valid[0];
    if (!file) return;
    receiptFiles.forEach(({ preview }) => { if (preview) URL.revokeObjectURL(preview); });
    const isPdf = file.type === "application/pdf";
    setReceiptFiles([{ file, preview: isPdf ? null : URL.createObjectURL(file), type: isPdf ? "pdf" : "image", name: file.name, size: file.size }]);
  };

  const removeFile = (index) => {
    setReceiptFiles((prev) => {
      const updated = [...prev];
      if (updated[index].preview) URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleDrop = (e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); };

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = "Full name is required.";
    if (!form.email.trim())   e.email   = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (!form.phone.trim())   e.phone   = "Phone number is required.";
    if (!form.address.trim()) e.address = "Shipping address is required.";
    if (!form.city.trim())    e.city    = "City is required.";
    if (!form.postal.trim())  e.postal  = "Postal code is required.";
    if (receiptFiles.length === 0) e.receipt = "Please upload your deposit receipt.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setApiError("");
    try {
      const order = await createOrder({
        order_type:       "cart",
        full_name:        form.name,
        customer_email:   form.email,
        phone_number:     form.phone,
        shipping_address: form.address,
        city:             form.city,
        postal_code:      form.postal,
      });

      const file = receiptFiles[0]?.file;
      if (file) await uploadReceipt(order.order_id, file);

      setOrderResult(order);
    } catch { /* synced via useEffect on hookError / uploadHookError */ }
  };

  const isLocked  = loading || uploadLoading || !!orderResult;
  const hasErrors = Object.keys(errors).length > 0 || !!apiError;

  return (
    <>
      {/* ── Success overlay — renders on top of the page ── */}
      {orderResult && (
        <OrderSuccessScreen
          orderResult={orderResult}
          rows={[
            ["Order ID", `#${orderResult.order_id}`],
            ["Name",     form.name],
            ["Email",    orderResult.customer_email],
            ["Phone",    orderResult.phone_number],
            ["Address",  `${orderResult.shipping_address}, ${orderResult.city} ${orderResult.postal_code}`],
            ["Items",    `${itemCount} item${itemCount !== 1 ? "s" : ""}`],
            ["Total",    formatLKR(orderResult.total_amount ?? grandTotal)],
            ["Status",   orderResult.order_status ?? "pending"],
            ["Receipts", `${receiptFiles.length} file${receiptFiles.length !== 1 ? "s" : ""} uploaded`],
          ]}
        />
      )}

      {/* ── Main checkout page ── */}
      <div className="h-full overflow-y-auto bg-[#f5f5f5] p-5 lg:p-6">

        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl" style={{ backgroundColor: "#fff", border: "1px solid #ebebeb" }}>
            <ShoppingCartOutlinedIcon style={{ fontSize: 18, color: "#555" }} />
          </div>
          <div>
            <p style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500 }}>Store / Checkout</p>
            <h1 style={{ ...SORA, fontSize: 20, fontWeight: 900, color: "#111", letterSpacing: "-0.3px" }}>Checkout</h1>
          </div>
        </div>

        {hasErrors && (
          <div className="flex items-start gap-3 px-4 py-3 rounded-xl mb-5" style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}>
            <WarningAmberOutlinedIcon style={{ fontSize: 16, color: "#e53935", flexShrink: 0, marginTop: 1 }} />
            <div>
              <p style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#e53935", marginBottom: 4 }}>
                {apiError ? "Unable to place order" : "Please fix the following before continuing:"}
              </p>
              {apiError
                ? <p style={{ ...INTER, fontSize: 12, color: "#e53935" }}>{apiError}</p>
                : Object.values(errors).map((err, i) => <p key={i} style={{ ...INTER, fontSize: 12, color: "#e53935" }}>• {err}</p>)
              }
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          <div className="lg:col-span-2 flex flex-col gap-5">

            <SectionCard title="Personal Information" subtitle="Checkout / Contact" icon={<PersonOutlinedIcon style={{ fontSize: 18, color: "#fff" }} />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <FieldLabel required>Full Name</FieldLabel>
                  <TextInput value={form.name} onChange={setField("name")} placeholder="e.g. John Fernando" icon={<PersonOutlinedIcon style={{ fontSize: 16 }} />} error={errors.name} />
                  <FieldError message={errors.name} />
                </div>
                <div>
                  <FieldLabel required>Email Address</FieldLabel>
                  <TextInput value={form.email} onChange={setField("email")} placeholder="john@example.com" type="email" icon={<EmailOutlinedIcon style={{ fontSize: 16 }} />} error={errors.email} />
                  <FieldError message={errors.email} />
                </div>
                <div>
                  <FieldLabel required>Phone Number</FieldLabel>
                  <TextInput value={form.phone} onChange={setField("phone")} placeholder="077 123 4567" type="tel" icon={<LocalPhoneOutlinedIcon style={{ fontSize: 16 }} />} error={errors.phone} />
                  <FieldError message={errors.phone} />
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Shipping Address" subtitle="Checkout / Delivery" icon={<LocationOnOutlinedIcon style={{ fontSize: 18, color: "#fff" }} />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <FieldLabel required>Street Address</FieldLabel>
                  <TextInput value={form.address} onChange={setField("address")} placeholder="123 Main Street, Apt 4B" icon={<LocationOnOutlinedIcon style={{ fontSize: 16 }} />} error={errors.address} />
                  <FieldError message={errors.address} />
                </div>
                <div>
                  <FieldLabel required>City</FieldLabel>
                  <TextInput value={form.city} onChange={setField("city")} placeholder="Colombo" icon={<LocationCityOutlinedIcon style={{ fontSize: 16 }} />} error={errors.city} />
                  <FieldError message={errors.city} />
                </div>
                <div>
                  <FieldLabel required>Postal Code</FieldLabel>
                  <TextInput value={form.postal} onChange={setField("postal")} placeholder="10100" icon={<MarkunreadMailboxOutlinedIcon style={{ fontSize: 16 }} />} error={errors.postal} />
                  <FieldError message={errors.postal} />
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Deposit Receipt" subtitle="Checkout / Payment Proof" icon={<ReceiptLongOutlinedIcon style={{ fontSize: 18, color: "#fff" }} />}>
              <label
                className="relative flex flex-col items-center justify-center w-full rounded-xl cursor-pointer transition-all"
                style={{ border: `2px dashed ${errors.receipt || uploadErr ? "#e53935" : "#ddd"}`, backgroundColor: "#fafafa", minHeight: 130 }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <input ref={fileRef} type="file" accept="image/jpeg,.jpg,.jpeg,application/pdf" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
                <div className="flex flex-col items-center gap-2 py-8 px-6 text-center pointer-events-none">
                  <CloudUploadOutlinedIcon style={{ fontSize: 34, color: "#bbb" }} />
                  <p style={{ ...INTER, fontSize: 12, fontWeight: 600, color: "#666" }}>Click to upload or drag & drop</p>
                  <p style={{ ...INTER, fontSize: 11, color: "#999" }}>{ALLOWED_LABEL} only · Max 10 MB</p>
                </div>
              </label>

              {(errors.receipt || uploadErr) && (
                <p className="flex items-center gap-1 mt-2" style={{ ...INTER, fontSize: 11, color: "#e53935" }}>
                  <WarningAmberOutlinedIcon style={{ fontSize: 12 }} />{uploadErr || errors.receipt}
                </p>
              )}

              {receiptFiles.length > 0 && (
                <div className="mt-4 flex flex-col gap-2">
                  {receiptFiles.map(({ preview, type, name, size }, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ backgroundColor: "#f9f9f9", border: "1px solid #ebebeb" }}>
                      {type === "image" ? (
                        <img src={preview} alt={name} className="rounded-lg object-cover shrink-0" style={{ width: 44, height: 44, border: "1px solid #ebebeb" }} />
                      ) : (
                        <div className="flex items-center justify-center rounded-lg shrink-0" style={{ width: 44, height: 44, backgroundColor: "#fff0f0", border: "1px solid #fecaca" }}>
                          <InsertDriveFileOutlinedIcon style={{ fontSize: 22, color: "#e53935" }} />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#111" }} className="truncate">{name}</p>
                        <p style={{ ...INTER, fontSize: 11, color: "#aaa" }}>{(size / 1024).toFixed(0)} KB · {type === "pdf" ? "PDF" : "JPEG"}</p>
                      </div>
                      <button
                        onClick={() => removeFile(i)}
                        className="flex items-center justify-center w-7 h-7 rounded-lg transition-all cursor-pointer shrink-0"
                        style={{ backgroundColor: "#fff", border: "1px solid #ebebeb", color: "#bbb" }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#e53935"; e.currentTarget.style.color = "#e53935"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#ebebeb"; e.currentTarget.style.color = "#bbb"; }}
                      >
                        <CloseIcon style={{ fontSize: 14 }} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>

          <div className="flex flex-col gap-5">
            <div className="bg-white rounded-2xl overflow-hidden sticky top-5" style={{ border: "1px solid #ebebeb", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <div className="flex items-center gap-3 px-6 py-4" style={{ borderBottom: "1px solid #f0f0f0" }}>
                <div className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0" style={{ backgroundColor: "#111" }}>
                  <ShoppingCartOutlinedIcon style={{ fontSize: 18, color: "#fff" }} />
                </div>
                <div>
                  <p style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500 }}>Checkout / Summary</p>
                  <h2 style={{ ...SORA, fontSize: 15, fontWeight: 900, color: "#111", letterSpacing: "-0.2px" }}>Order Summary</h2>
                </div>
              </div>

              <div className="px-6 py-5 flex flex-col gap-4">

                {items && items.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-start gap-3 py-2" style={{ borderBottom: "1px solid #f5f5f5" }}>
                        <div className="flex items-center justify-center rounded-lg shrink-0" style={{ width: 36, height: 36, backgroundColor: "#f5f5f5", border: "1px solid #ebebeb" }}>
                          <InventoryOutlinedIcon style={{ fontSize: 16, color: "#bbb" }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p style={{ ...INTER, fontSize: 11, fontWeight: 700, color: "#111", lineHeight: 1.4 }} className="line-clamp-2">{item.name}</p>
                          {item.quantity && <p style={{ ...INTER, fontSize: 10, color: "#aaa", marginTop: 2 }}>Qty: {item.quantity}</p>}
                        </div>
                        <p style={{ ...INTER, fontSize: 11, fontWeight: 700, color: "#111", whiteSpace: "nowrap" }}>{formatLKR(item.price)}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between py-1.5" style={{ borderBottom: "1px solid #f5f5f5" }}>
                    <span style={{ ...INTER, fontSize: 12, color: "#888", fontWeight: 600 }}>Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""})</span>
                    <span style={{ ...INTER, fontSize: 12, color: "#111", fontWeight: 700 }}>{formatLKR(total)}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5" style={{ borderBottom: "1px solid #f5f5f5" }}>
                    <span style={{ ...INTER, fontSize: 12, color: "#888", fontWeight: 600 }}>Shipping</span>
                    {shipping === 0
                      ? <span style={{ ...INTER, fontSize: 12, color: "#16a34a", fontWeight: 700 }}>Free</span>
                      : <span style={{ ...INTER, fontSize: 12, color: "#111", fontWeight: 700 }}>{formatLKR(shipping)}</span>
                    }
                  </div>
                </div>

                {shipping > 0 && (
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ backgroundColor: "#fffbeb", border: "1px solid #fde68a" }}>
                    <WarningAmberOutlinedIcon style={{ fontSize: 13, color: "#d97706" }} />
                    <p style={{ ...INTER, fontSize: 11, fontWeight: 600, color: "#92400e" }}>
                      Add {formatLKR(SHIPPING_THRESHOLD - total)} more for free shipping
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ backgroundColor: "#f5f5f5" }}>
                  <span style={{ ...SORA, fontSize: 13, fontWeight: 900, color: "#111" }}>Total</span>
                  <span style={{ ...SORA, fontSize: 16, fontWeight: 900, color: "#111" }}>{formatLKR(grandTotal)}</span>
                </div>

                {receiptFiles.length > 0 && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                    <CheckCircleOutlinedIcon style={{ fontSize: 15, color: "#16a34a" }} />
                    <p style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#15803d" }}>Receipt attached</p>
                  </div>
                )}

                <button
                  onClick={handleSubmit} disabled={isLocked || !itemCount}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ ...SORA, fontSize: 13, fontWeight: 700, backgroundColor: "#111", border: "none" }}
                  onMouseEnter={(e) => { if (!isLocked) e.currentTarget.style.backgroundColor = "#333"; }}
                  onMouseLeave={(e) => { if (!isLocked) e.currentTarget.style.backgroundColor = "#111"; }}
                >
                  {loading
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Placing Order…</>
                    : uploadLoading
                      ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Uploading Receipt…</>
                      : <><SendOutlinedIcon style={{ fontSize: 16 }} /> Place Order</>
                  }
                </button>

                <p style={{ ...INTER, fontSize: 11, color: "#bbb", textAlign: "center", lineHeight: 1.6 }}>
                  By placing your order you agree to our terms and conditions.
                  Your deposit receipt will be verified before dispatch.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}