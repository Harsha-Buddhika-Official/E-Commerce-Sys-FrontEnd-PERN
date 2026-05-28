import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { useBrandNames } from "../../features/brands/hooks/useBrandNames.js";
import { useCategories } from "../../features/categories/hooks/useCategories.js";
import { useCreateProduct } from "../../features/products/hooks/useCreateProduct.js";
import {
  ACCEPTED_TYPES,
  ErrorBanner,
  FieldError,
  FieldLabel,
  MAX_FILE_SIZE,
  MAX_IMAGES,
  PreviewRow,
  SectionCard,
  SectionHeader,
  SelectField,
  TAG_OPTIONS,
  TextField,
  formatLabel,
  normalizeOptions,
  INTER,
  SORA,
} from "./components/AddProductUi.jsx";

const AddProductBasicPage = ({ onCancel = () => {} }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { brandNames, loading: brandsLoading, error: brandsError } = useBrandNames();
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { createProduct } = useCreateProduct();

  const [form, setForm] = useState({
    name: "",
    brand_name: "",
    category_id: "",
    category_name: "",
    description: "",
    base_price: "",
    discounted_price: "",
    selling_price: "",
    stock_quantity: "",
    warranty_months: "",
    product_tag: "",
  });

  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});

  const brandOptions = useMemo(() => normalizeOptions(brandNames, ["brand_name", "name", "label", "brand_id", "id"], ["brand_name", "name", "label"]), [brandNames]);
  const categoryOptions = useMemo(() => normalizeOptions(categories, ["category_id", "id"], ["category_name", "name", "label"]), [categories]);
  const selectedBrand = useMemo(() => brandOptions.find((option) => option.label === form.brand_name || option.value === form.brand_name) || null, [brandOptions, form.brand_name]);

  useEffect(() => {
    return () => {
      images.forEach((image) => image.preview && URL.revokeObjectURL(image.preview));
    };
  }, [images]);

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setSaved(false);
    setErrors((current) => {
      const next = { ...current };
      delete next[key];
      delete next.form;
      return next;
    });
  };

  const handleBrandChange = (value) => {
    const option = brandOptions.find((item) => item.value === value);
    updateField("brand_name", option?.label || value);
  };

  const handleCategoryChange = (value) => {
    const option = categoryOptions.find((item) => item.value === value);
    updateField("category_id", value);
    updateField("category_name", option?.label || value);
  };

  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files || []);
    const next = [];
    let nextError = "";

    for (const file of files) {
      if (images.length + next.length >= MAX_IMAGES) {
        nextError = `Up to ${MAX_IMAGES} images allowed.`;
        break;
      }
      if (!ACCEPTED_TYPES.includes(file.type)) {
        nextError = "Only JPG, PNG, WebP allowed.";
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        nextError = "Each file must be <= 10MB.";
        continue;
      }
      next.push({ id: `${file.name}-${file.size}`, file, preview: URL.createObjectURL(file), name: file.name });
    }

    if (next.length) {
      setImages((current) => [...current, ...next].slice(0, MAX_IMAGES));
      setErrors((current) => {
        const nextErrors = { ...current };
        delete nextErrors.images;
        return nextErrors;
      });
    }
    if (nextError) setErrors((current) => ({ ...current, images: nextError }));
    event.target.value = "";
  };

  const removeImage = (index) => {
    setImages((current) => {
      const next = [...current];
      if (next[index]?.preview) URL.revokeObjectURL(next[index].preview);
      next.splice(index, 1);
      return next;
    });
  };

  const validate = () => {
    const nextErrors = {};
    const name = form.name.trim();
    const brandName = form.brand_name.trim();
    const categoryName = form.category_name.trim();
    const description = form.description.trim();

    const basePrice = Number(form.base_price);
    const discountedPrice = Number(form.discounted_price);
    const sellingPrice = Number(form.selling_price);

    if (!name) nextErrors.name = "Product name is required.";
    else if (name.length < 3 || name.length > 255) nextErrors.name = "Name must be between 3 and 255 characters.";

    if (!brandName) nextErrors.brand_name = "Please choose a brand.";
    else if (brandName.length < 2 || brandName.length > 100) nextErrors.brand_name = "Brand must be between 2 and 100 characters.";

    if (!categoryName) nextErrors.category_name = "Please choose a category.";
    else if (categoryName.length < 2 || categoryName.length > 100) nextErrors.category_name = "Category must be between 2 and 100 characters.";

    if (!form.base_price || Number.isNaN(basePrice) || basePrice <= 0) nextErrors.base_price = "Base price must be a positive number.";
    if (!form.discounted_price || Number.isNaN(discountedPrice) || discountedPrice <= 0) nextErrors.discounted_price = "Discounted price must be a positive number.";
    if (!form.selling_price || Number.isNaN(sellingPrice) || sellingPrice <= 0) nextErrors.selling_price = "Selling price must be a positive number.";

    if (description.length > 1000) nextErrors.description = "Description must be 1000 characters or less.";

    if (form.stock_quantity !== "") {
      const stock = Number(form.stock_quantity);
      if (!Number.isInteger(stock) || stock < 0) nextErrors.stock_quantity = "Stock quantity must be an integer >= 0.";
    }

    if (form.warranty_months !== "") {
      const warranty = Number(form.warranty_months);
      if (!Number.isInteger(warranty) || warranty < 0) nextErrors.warranty_months = "Warranty months must be an integer >= 0.";
    }

    if (form.product_tag && String(form.product_tag).length > 255) {
      nextErrors.product_tag = "Product tag must be 255 characters or less.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validate()) return;
    setSaving(true);
    setSaved(false);

    try {
      const payload = new FormData();
      payload.append("name", form.name.trim());
      payload.append("brand_name", form.brand_name.trim());
      payload.append("category_name", form.category_name.trim());
      if (form.description.trim()) payload.append("description", form.description.trim());
      payload.append("base_price", String(Number(form.base_price)));
      payload.append("discounted_price", String(Number(form.discounted_price)));
      payload.append("selling_price", String(Number(form.selling_price)));
      if (form.stock_quantity !== "") payload.append("stock_quantity", String(parseInt(form.stock_quantity, 10)));
      if (form.warranty_months !== "") payload.append("warranty_months", String(parseInt(form.warranty_months, 10)));
      if (form.product_tag) payload.append("product_tag", form.product_tag);
      images.forEach(({ file }) => payload.append("images", file));

      const created = await createProduct(payload);
      const createdData = created?.data ?? created ?? {};
      const productId = createdData.product_id ?? createdData.id ?? createdData.productId;
      if (!productId) throw new Error("Product created but no id returned.");

      navigate("/admin/products/add/attributes", {
        state: {
          productId,
          categoryId: Number(form.category_id),
          categoryName: form.category_name,
          product: createdData,
        },
      });
    } catch (error) {
      let formMessage = error?.message || "Failed to create product.";
      if (error?.status === 400) formMessage = error?.message || "Invalid product data. Please check the form fields.";
      if (error?.status === 404) formMessage = error?.message || "Selected brand or category was not found.";
      if (error?.status === 409) formMessage = error?.message || "A product with this name already exists.";
      if (error?.status >= 500) formMessage = error?.message || "Server error while creating product. Please try again.";
      setErrors((current) => ({ ...current, form: formMessage }));
    } finally {
      setSaving(false);
    }
  };

  const hasLoadError = brandsError || categoriesError;

  return (
    <main className="h-full overflow-y-auto bg-[#f5f5f5] px-5 py-6 lg:px-6 lg:py-7">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button
          onClick={() => { onCancel?.(); navigate("/admin/products"); }}
          className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-all cursor-pointer shrink-0"
        >
          <ArrowBackOutlinedIcon style={{ fontSize: 18 }} />
        </button>
        <div className="min-w-0">
          <p style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500 }}>Catalogue / Products</p>
          <h1 style={{ ...SORA, fontSize: 22, fontWeight: 900, color: "#111", letterSpacing: "-0.3px" }}>Create Product</h1>
        </div>
        <div className="ml-auto flex items-center gap-2.5">
          <button
            onClick={() => { onCancel?.(); navigate("/admin/products"); }}
            className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-all cursor-pointer"
            style={{ ...INTER, fontSize: 13, fontWeight: 600 }}
          >
            Cancel
          </button>
          <button
            onClick={handleNext}
            disabled={saving || brandsLoading || categoriesLoading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white transition-all disabled:opacity-60 cursor-pointer"
            style={{ ...SORA, fontSize: 13, fontWeight: 700, backgroundColor: saved ? "#16a34a" : "#111", border: "none" }}
          >
            {saving ? (
              <><span className="w-4 h-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Creating…</>
            ) : saved ? (
              <><CheckCircleOutlinedIcon style={{ fontSize: 16 }} />Saved!</>
            ) : (
              <><SaveOutlinedIcon style={{ fontSize: 16 }} />Next</>
            )}
          </button>
        </div>
      </div>

      {(hasLoadError || errors.form || errors.images) && (
        <div className="flex flex-col gap-3 mb-5">
          {hasLoadError && <ErrorBanner title="Data failed to load" message={hasLoadError} />}
          {errors.form && <ErrorBanner title="Unable to create product" message={errors.form} />}
          {errors.images && <ErrorBanner title="Image upload issue" message={errors.images} />}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 flex flex-col gap-5">
          <SectionCard>
            <SectionHeader icon={<InventoryOutlinedIcon style={{ fontSize: 18 }} />} title="Basic Information" subtitle="Core product details" />
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <FieldLabel required>Product Name</FieldLabel>
                <TextField value={form.name} onChange={(value) => updateField("name", value)} placeholder="Enter product name" error={Boolean(errors.name)} />
                <FieldError message={errors.name} />
              </div>
              <div>
                <FieldLabel required>Brand</FieldLabel>
                <SelectField
                  value={selectedBrand?.value || form.brand_name}
                  onChange={handleBrandChange}
                  options={brandOptions}
                  placeholder={brandsLoading ? "Loading brands…" : "Select brand"}
                  error={Boolean(errors.brand_name)}
                  disabled={brandsLoading || brandOptions.length === 0}
                />
                <FieldError message={errors.brand_name} />
              </div>
              <div>
                <FieldLabel required>Category</FieldLabel>
                <SelectField
                  value={form.category_id}
                  onChange={handleCategoryChange}
                  options={categoryOptions}
                  placeholder={categoriesLoading ? "Loading categories…" : "Select category"}
                  error={Boolean(errors.category_name)}
                  disabled={categoriesLoading || categoryOptions.length === 0}
                />
                <FieldError message={errors.category_name} />
              </div>
              <div className="md:col-span-2">
                <FieldLabel>Description</FieldLabel>
                <TextField value={form.description} onChange={(value) => updateField("description", value)} placeholder="Describe the product…" rows={4} />
              </div>
            </div>
          </SectionCard>

          <SectionCard>
            <SectionHeader icon={<LocalOfferOutlinedIcon style={{ fontSize: 18 }} />} title="Pricing & Inventory" subtitle="Prices in LKR" />
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { label: "Base Price", key: "base_price", required: true, type: "number", placeholder: "0.00" },
                { label: "Discounted Price", key: "discounted_price", required: true, type: "number", placeholder: "0.00" },
                { label: "Selling Price", key: "selling_price", required: true, type: "number", placeholder: "0.00" },
                { label: "Stock Quantity", key: "stock_quantity", required: false, type: "number", placeholder: "0" },
                { label: "Warranty (months)", key: "warranty_months", required: false, type: "number", placeholder: "12" },
              ].map(({ label, key, required, type, placeholder }) => (
                <div key={key}>
                  <FieldLabel required={required}>{label}</FieldLabel>
                  <TextField value={form[key]} onChange={(value) => updateField(key, value)} placeholder={placeholder} type={type} error={Boolean(errors[key])} />
                  <FieldError message={errors[key]} />
                </div>
              ))}
              <div>
                <FieldLabel>Product Tag</FieldLabel>
                <SelectField
                  value={form.product_tag}
                  onChange={(value) => updateField("product_tag", value)}
                  options={TAG_OPTIONS.map((tag) => ({ value: tag, label: tag ? formatLabel(tag) : "No tag" }))}
                  placeholder="Choose a tag"
                />
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="flex flex-col gap-5">
          <SectionCard>
            <SectionHeader icon={<ImageOutlinedIcon style={{ fontSize: 18 }} />} title="Product Images" subtitle={`Up to ${MAX_IMAGES} files, 10MB each`} />
            <div className="p-6">
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" multiple className="hidden" onChange={handleImageSelect} />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-2.5 w-full py-7 rounded-2xl border-2 border-dashed cursor-pointer transition-all"
                style={{ borderColor: "#e5e5e5", backgroundColor: "#f9f9f9" }}
                onMouseEnter={(event) => { event.currentTarget.style.borderColor = "#111"; event.currentTarget.style.backgroundColor = "#f5f5f5"; }}
                onMouseLeave={(event) => { event.currentTarget.style.borderColor = "#e5e5e5"; event.currentTarget.style.backgroundColor = "#f9f9f9"; }}
              >
                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-white" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                  <CloudUploadOutlinedIcon style={{ fontSize: 22, color: "#111" }} />
                </div>
                <div className="text-center">
                  <p style={{ ...SORA, fontSize: 13, fontWeight: 700, color: "#111" }}>Upload images</p>
                  <p style={{ ...INTER, fontSize: 11, color: "#aaa", marginTop: 2 }}>JPG, JPEG, PNG, WebP</p>
                </div>
              </button>

              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2.5">
                  {images.map((image, index) => (
                    <div key={image.id} className="relative rounded-xl overflow-hidden border border-[#ebebeb] bg-[#f7f7f7]" style={{ aspectRatio: "1" }}>
                      <img src={image.preview} alt={image.name} className="w-full h-full object-contain p-2" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1.5 right-1.5 flex items-center justify-center w-5 h-5 rounded-full text-white cursor-pointer transition-all"
                        style={{ backgroundColor: "rgba(0,0,0,0.65)" }}
                      >
                        <CloseOutlinedIcon style={{ fontSize: 12 }} />
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-md" style={{ backgroundColor: "rgba(0,0,0,0.65)" }}>
                          <span style={{ ...INTER, fontSize: 9, fontWeight: 700, color: "#fff" }}>Primary</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-3 px-3 py-2.5 rounded-xl" style={{ backgroundColor: "#f5f5f5", border: "1px solid #ebebeb" }}>
                <p style={{ ...INTER, fontSize: 11, fontWeight: 500, color: "#aaa" }}>First image will be set as the primary image.</p>
              </div>
            </div>
          </SectionCard>

          <SectionCard>
            <SectionHeader icon={<InventoryOutlinedIcon style={{ fontSize: 18 }} />} title="Summary" subtitle="Quick form overview" />
            <div className="px-6 py-4">
              <PreviewRow label="Brand" value={form.brand_name} />
              <PreviewRow label="Category" value={form.category_name} />
              <PreviewRow label="Tag" value={form.product_tag ? formatLabel(form.product_tag) : null} />
              <PreviewRow label="Images" value={`${images.length} / ${MAX_IMAGES}`} />
              <PreviewRow label="Attributes" value="Appears after Next" />
            </div>
          </SectionCard>
        </div>
      </div>
    </main>
  );
};

export default AddProductBasicPage;
