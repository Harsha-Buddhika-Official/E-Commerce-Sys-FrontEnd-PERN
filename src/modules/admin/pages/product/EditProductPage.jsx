import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useProductDetail } from "../../features/products/hooks/useProductDetail";
import { useCategories } from "../../features/categories/hooks/useCategories.js";
import { useBrandNames } from "../../features/brands/hooks/useBrandNames.js";
import { normalizeOptions } from "./components/AddProductUi.jsx";
import { normalizeProductForForm } from "../../features/products/service/products.service.js";
import  { useUpdateProduct } from "../../features/products/hooks/useUpdateProduct.js";
import { useProductAttributes } from "../../features/products/hooks/useProductAttributes.js";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import {
  DiscardModal,
  EditProductHeader,
  LoadingState,
  NotFoundState,
  SectionCard,
  SectionTitle,
  ProductAttributesSection,
  ProductBasicsSection,
  ProductImagesSection,
  ProductInventorySection,
  ProductPricingSection,
} from "./components/EditProductUi.jsx";

const SORA = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

// normalization helpers moved to service layer

// ══════════════════════════════════════════════════════════════════════════════
// EDIT PRODUCT PAGE
// ══════════════════════════════════════════════════════════════════════════════
const EditProductPage = ({
  product = null,
  onBack  = () => {},
  onSave  = () => {},
}) => {
  const { id: routeProductId } = useParams();
  const fileInputRef  = useRef(null);
  const hydratedRef   = useRef(null);

  const [dirty,       setDirty]       = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);
  const [saving,      setSaving]      = useState(false);
  const [saved,       setSaved]       = useState(false);

  const productId = product?.product_id ?? product?.id ?? routeProductId;
  const { product: fetchedProduct, loading: detailLoading, error: detailError } = useProductDetail(productId);
  const sourceProduct = fetchedProduct ?? product;
  const { categories: categoryList, loading: categoriesLoading } = useCategories();
  const { brandNames: brandList, loading: brandsLoading } = useBrandNames();
  const { updateProduct, loading: updateLoading } = useUpdateProduct();

  // ── Form state ────────────────────────────────────────────────────────────
  const [name,           setName]           = useState("");
  const [description,    setDescription]    = useState("");
  const [brandName,      setBrandName]      = useState("");
  const [brandId,        setBrandId]        = useState("");
  const [categoryId,     setCategoryId]     = useState("");
  const [categoryName,   setCategoryName]   = useState("");
  const [basePrice,      setBasePrice]      = useState("");
  const [sellingPrice,   setSellingPrice]   = useState("");
  const [discPrice,      setDiscPrice]      = useState("");
  const [stockQty,       setStockQty]       = useState(0);
  const [warrantyMonths, setWarrantyMonths] = useState(12);
  const [images,         setImages]         = useState([]);
  const [attributeSelections, setAttributeSelections] = useState({});

  

  // ── Hydrate from API ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!sourceProduct || dirty || hydratedRef.current === sourceProduct) return;
    const n = normalizeProductForForm(sourceProduct);
    setName(n.name); setDescription(n.description);
    setBrandName(n.brand_name); setBrandId(String(n.brand_id ?? "")); setCategoryName(n.category_name); setCategoryId(String(n.category_id ?? ""));
    setBasePrice(n.base_price); setSellingPrice(n.selling_price); setDiscPrice(n.discounted_price);
    setStockQty(Number(n.stock_quantity));
    setWarrantyMonths(Number(n.warranty_months));
    setImages(n.images);
    const nextSelections = {};
    (Array.isArray(sourceProduct.attributes) ? sourceProduct.attributes : []).forEach((attr) => {
      if (attr?.attribute_id) {
        nextSelections[String(attr.attribute_id)] = String(attr.attribute_value_id ?? "");
      }
    });
    setAttributeSelections(nextSelections);
    setDirty(false); setSaved(false);
    hydratedRef.current = sourceProduct;
  }, [sourceProduct, dirty]);

  const productCategoryId = categoryId || sourceProduct?.category_id || "";
  const { attributes: catalogAttributes, loading: attributesLoading, error: attributesError } = useProductAttributes(productCategoryId);

  const markDirty = () => { setDirty(true); setSaved(false); };
  const field = (setter) => (val) => { setter(val); markDirty(); };

  const handleNameChange = (val) => { setName(val); markDirty(); };

  // Attribute direct-edit helpers removed; attributes are selected via catalog-driven UI

  // ── Image ops ─────────────────────────────────────────────────────────────
  // (URL-based image addition removed — uploads only)
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImgs = files.map((f, i) => ({ _key: Date.now() + i, image_id: null, image_url: URL.createObjectURL(f), alt_text: f.name.replace(/\.[^.]+$/, ""), is_primary: images.length === 0 && i === 0, sort_order: images.length + i, _file: f }));
    setImages((p) => [...p, ...newImgs]); markDirty();
  };
  const setPrimary  = (key) => { setImages((p) => p.map((img) => ({ ...img, is_primary: img._key === key }))); markDirty(); };
  const updateAlt   = (key, val) => { setImages((p) => p.map((img) => img._key === key ? { ...img, alt_text: val } : img)); markDirty(); };
  const removeImage = (key) => {
    setImages((p) => {
      const f = p.filter((img) => img._key !== key);
      if (!f.some((img) => img.is_primary) && f.length > 0) f[0].is_primary = true;
      return f.map((img, i) => ({ ...img, sort_order: i }));
    }); markDirty();
  };
  const moveImage = (key, dir) => {
    setImages((p) => {
      const idx = p.findIndex((img) => img._key === key);
      if ((dir === -1 && idx === 0) || (dir === 1 && idx === p.length - 1)) return p;
      const next = [...p];
      [next[idx], next[idx + dir]] = [next[idx + dir], next[idx]];
      return next.map((img, i) => ({ ...img, sort_order: i }));
    }); markDirty();
  };

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!name.trim())  { alert("Product name is required."); return; }
    if (!sellingPrice) { alert("Selling price is required."); return; }
    if (Number(discPrice) > Number(sellingPrice)) { alert("Discounted price cannot exceed selling price."); return; }
    const localFiles = images.filter((img) => img._file || String(img.image_url || "").startsWith("blob:"));

    setSaving(true);

    const normalizedAttributes = (Array.isArray(catalogAttributes) ? catalogAttributes : [])
      .map((attribute) => {
        const selectedValue = attributeSelections[String(attribute.attribute_id)];
        const matchedValue = (attribute.values || []).find((value) =>
          String(value.attribute_value_id) === String(selectedValue) || String(value.value) === String(selectedValue),
        );

        return matchedValue?.attribute_value_id
          ? {
              attribute_id: Number(attribute.attribute_id),
              attribute_value_id: Number(matchedValue.attribute_value_id),
            }
          : null;
      })
        .filter((attr) => attr && Number.isInteger(attr.attribute_id) && attr.attribute_id > 0 && Number.isInteger(attr.attribute_value_id) && attr.attribute_value_id > 0);

    const payload = {
      product_id: Number(productId),
      name: name || undefined,
      description: description || undefined,
      brand_id: brandId ? Number(brandId) : undefined,
      brand_name:  brandName ? brandName : undefined,
      category_id: categoryId ? Number(categoryId) : undefined,
      category_name: !categoryId ? categoryName || undefined : undefined,
      base_price: basePrice !== "" ? Number(basePrice) : undefined,
      selling_price: sellingPrice !== "" ? Number(sellingPrice) : undefined,
      discounted_price: discPrice !== "" ? Number(discPrice) : undefined,
      stock_quantity: stockQty !== "" ? Number(stockQty) : undefined,
      warranty_months: warrantyMonths === "" || warrantyMonths === null ? null : Number(warrantyMonths),
    };

    if (normalizedAttributes.length) {
      payload.attributes = normalizedAttributes;
    }

    try {
      let updated;

      // Let the service layer handle FormData creation and uploads;
      // pass payload and images array so service can determine upload strategy.
      if (localFiles.length > 0 && localFiles.length > 3) {
        alert("You can upload up to 3 images only.");
        setSaving(false);
        return;
      }

      console.debug("Updating product with payload and images metadata:", { payload, images });
      updated = await updateProduct(productId, payload, images);
      setSaving(false);
      setSaved(true);
      setDirty(false);
      onSave(updated);
    } catch (error) {
      const body = error?.cause?.body ?? error?.body ?? error?.cause?.response?.data ?? error?.response?.data;
      console.error("Product update failed:", { error, body, payload });

      // Build detailed message
      let message = body?.message || error?.message || "Failed to update product";
      if (Array.isArray(body?.error) && body.error.length) {
        try {
          message = body.error.map((it) => {
            if (typeof it === "string") return it;
            if (it?.message) return it.message;
            return JSON.stringify(it);
          }).join("; ");
        } catch (e) {
          // fallback
          message = JSON.stringify(body.error);
        }
      }

      // If FormData was used, additionally log that fact
      if (localFiles.length > 0) console.error("Request used multipart/form-data with files:", localFiles.map((f) => f._file?.name || f.image_url));

      alert(`Failed to update product: ${message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => { if (dirty) setShowDiscard(true); else onBack(); };

  const fetchedBrandOptions = normalizeOptions(brandList, ["brand_id", "id"], ["brand_name", "name", "label"]);
  const fetchedCategoryOptions = normalizeOptions(categoryList, ["category_id", "id"], ["category_name", "name", "label"]);
  const fallbackBrandOptions = [];
  const fallbackCategoryOptions = [];
  const categoryOptions = (Array.isArray(fetchedCategoryOptions) && fetchedCategoryOptions.length) ? fetchedCategoryOptions : fallbackCategoryOptions;
  const brandOptions = (Array.isArray(fetchedBrandOptions) && fetchedBrandOptions.length) ? fetchedBrandOptions : fallbackBrandOptions;


  const handleCategorySelect = (value) => {
    const option = categoryOptions.find((o) => String(o.value) === String(value));
    console.log(option)
    setCategoryId(String(value));
    setCategoryName(option?.label || value);
    markDirty();
  };

  const handleBrandSelect = (value) => {
    const option = brandOptions.find((o) => String(o.value) === String(value));
    console.log(option)
    setBrandId(String(value));
    setBrandName(option?.label || value);
    markDirty();
  };
  const discPriceError  = discPrice && Number(discPrice) > Number(sellingPrice);

  const attributeOptionsById = (Array.isArray(catalogAttributes) ? catalogAttributes : []).reduce((acc, attribute) => {
    acc[String(attribute.attribute_id)] = [
      { value: "", label: "Select value" },
      ...(Array.isArray(attribute.values)
        ? attribute.values.map((value) => ({ value: String(value.attribute_value_id), label: value.value || String(value.attribute_value_id) }))
        : []),
    ];
    return acc;
  }, {});

  // Ensure the select has an option for the current brandId (inject temp option if needed)
  // const brandOptions = (() => {
  //   if (!brandId) return baseBrandOptions;
  //   const found = baseBrandOptions.find((o) => String(o.value) === String(brandId));
  //   if (found) return baseBrandOptions;
  //   return [{ value: brandId, label: brandName || brandId }, ...baseBrandOptions];
  // })();

  if (!sourceProduct && detailLoading) return <LoadingState />;

  if (!sourceProduct && detailError) return <NotFoundState error={detailError} onBack={handleBack} />;

  return (
    <div className="h-full overflow-y-auto bg-[#f5f5f5] p-5 lg:p-6">
      {showDiscard && (
        <DiscardModal
          onConfirm={() => { setShowDiscard(false); onBack(); }}
          onCancel={() => setShowDiscard(false)}
        />
      )}

      <EditProductHeader
        productId={productId}
        dirty={dirty}
        saved={saved}
        saving={saving}
        updateLoading={updateLoading}
        onBack={handleBack}
        onSave={handleSave}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 flex flex-col gap-5">
          <ProductBasicsSection
            name={name}
            onNameChange={handleNameChange}
            description={description}
            onDescriptionChange={(value) => { setDescription(value); markDirty(); }}

            brandId={brandId}
            brandOptions={brandOptions}
            onBrandChange={handleBrandSelect}

            categoryId={categoryId}
            categoryOptions={categoryOptions}
            onCategoryChange={handleCategorySelect}
          />

          <ProductImagesSection
            images={images}
            onFileUpload={handleFileUpload}
            onSetPrimary={setPrimary}
            onUpdateAlt={updateAlt}
            onRemoveImage={removeImage}
            onMoveImage={moveImage}
            fileInputRef={fileInputRef}
          />

          <ProductAttributesSection
            productCategoryId={productCategoryId}
            catalogAttributes={catalogAttributes}
            attributesLoading={attributesLoading}
            attributesError={attributesError}
            attributeSelections={attributeSelections}
            onAttributeChange={(attributeId, value) => {
              setAttributeSelections((current) => ({ ...current, [attributeId]: value }));
              markDirty();
            }}
            attributeOptionsById={attributeOptionsById}
          />
        </div>

        <div className="flex flex-col gap-5">
          <ProductPricingSection
            basePrice={basePrice}
            sellingPrice={sellingPrice}
            discPrice={discPrice}
            onBasePriceChange={field(setBasePrice)}
            onSellingPriceChange={field(setSellingPrice)}
            onDiscPriceChange={field(setDiscPrice)}
            discPriceError={discPriceError}
          />

          <ProductInventorySection
            stockQty={stockQty}
            onStockQtyChange={(value) => { setStockQty(value); markDirty(); }}
            warrantyMonths={warrantyMonths}
            onWarrantyMonthsChange={field(setWarrantyMonths)}
          />

          <SectionCard>
            <SectionTitle icon={<ReceiptOutlinedIcon style={{ fontSize: 16 }} />}>
              Summary
            </SectionTitle>
            <div className="flex flex-col gap-0">
              {[
                { label: "Brand", value: brandName || brandId || "—" },
                { label: "Category", value: categoryName || categoryId || "—" },
                { label: "Images", value: String(images.length) },
                { label: "Attributes", value: String(Array.isArray(catalogAttributes) ? catalogAttributes.length : 0) },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-[#f8f8f8] last:border-0">
                  <span style={{ ...INTER, fontSize: 12, fontWeight: 600, color: "#aaa" }}>{item.label}</span>
                  <span style={{ ...INTER, fontSize: 13, fontWeight: 700, color: item.value ? "#111" : "#ccc" }}>{item.value}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default EditProductPage;