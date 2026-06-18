import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProductDetail }        from "../../features/products/hooks/useProductDetail";
import { useCategories }           from "../../features/categories/hooks/useCategories.js";
import { useBrandNames }           from "../../features/brands/hooks/useBrandNames.js";
import { normalizeOptions }        from "./components/AddProductUi.jsx";
import { normalizeProductForForm } from "../../features/products/service/product.normalizer.js";
import { useUpdateProductDetails } from "../../features/products/hooks/useUpdateProductDetails.js";
import { useAddProductImages }     from "../../features/products/hooks/useAddProductImages.js";
import { useRemoveProductImage }   from "../../features/products/hooks/useRemoveProductImage.js";
import { useReorderProductImages } from "../../features/products/hooks/useReorderProductImages.js";
import { useProductAttributes }    from "../../features/products/hooks/useProductAttributes.js";
import AttributeCreateOverlay from "../../overlay/AttributeCreateOverlay.jsx";
import CreateAttributeValueOverlay from "../../overlay/CreateAttributeValueOverlay.jsx";
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

const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

const EditProductPage = ({
  product = null,
  onSave  = () => {},
}) => {
  const { id: routeProductId } = useParams();
  const hydratedRef = useRef(null);

  const [dirty,       setDirty]       = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);
  const [saving,      setSaving]      = useState(false);
  const [saved,       setSaved]       = useState(false);
  const navigate = useNavigate();

  // ── Attribute creation overlays ─────────────────────────────────
  const [showAttrCreate, setShowAttrCreate] = useState(false);
  const [createValueFor, setCreateValueFor] = useState(null);
  const [refreshKey,     setRefreshKey]     = useState(0);

  const productId     = product?.product_id ?? product?.id ?? routeProductId;
  const { product: fetchedProduct, loading: detailLoading, error: detailError } = useProductDetail(productId);
  const sourceProduct = fetchedProduct ?? product;

  const { categories: categoryList } = useCategories();
  const { brandNames: brandList }    = useBrandNames();

  const { updateDetails, loading: updateLoading }                            = useUpdateProductDetails();
  const { addImages,     loading: addImagesLoading }     = useAddProductImages();
  const { removeImage: removeImageApi }                  = useRemoveProductImage();
  const { reorderImages, loading: reorderImagesLoading } = useReorderProductImages();

  const [pendingImageAdds,    setPendingImageAdds]    = useState([]); // File[]
  const [pendingImageRemoves, setPendingImageRemoves] = useState([]); // image_id[]

  // ── Form state ────────────────────────────────────────────────
  const [name,                setName]                = useState("");
  const [description,         setDescription]         = useState("");
  const [brandName,           setBrandName]           = useState("");
  const [brandId,             setBrandId]             = useState("");
  const [categoryId,          setCategoryId]          = useState("");
  const [categoryName,        setCategoryName]        = useState("");
  const [basePrice,           setBasePrice]           = useState("");
  const [sellingPrice,        setSellingPrice]        = useState("");
  const [discPrice,           setDiscPrice]           = useState("");
  const [stockQty,            setStockQty]            = useState(0);
  const [warrantyMonths,      setWarrantyMonths]      = useState(12);
  const [images,              setImages]              = useState([]);
  const [attributeSelections, setAttributeSelections] = useState({});

  // ── Hydrate ───────────────────────────────────────────────────
  useEffect(() => {
    if (!sourceProduct || dirty || hydratedRef.current === sourceProduct) return;
    const n = normalizeProductForForm(sourceProduct);
    setName(n.name);
    setDescription(n.description);
    setBrandName(n.brand_name);
    setBrandId(String(n.brand_id ?? ""));
    setCategoryName(n.category_name);
    setCategoryId(String(n.category_id ?? ""));
    setBasePrice(n.base_price);
    setSellingPrice(n.selling_price);
    setDiscPrice(n.discounted_price);
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
    setDirty(false);
    setSaved(false);
    hydratedRef.current = sourceProduct;
  }, [sourceProduct, dirty]);

  const productCategoryId = categoryId || sourceProduct?.category_id || "";
  const { attributes: catalogAttributes, loading: attributesLoading, error: attributesError } = useProductAttributes(productCategoryId, refreshKey);

  const markDirty = ()       => { setDirty(true); setSaved(false); };
  const field     = (setter) => (val) => { setter(val); markDirty(); };

  // ── Options ───────────────────────────────────────────────────
  const fetchedBrandOptions    = normalizeOptions(brandList,    ["brand_id",    "id"], ["brand_name",    "name", "label"]);
  const fetchedCategoryOptions = normalizeOptions(categoryList, ["category_id", "id"], ["category_name", "name", "label"]);
  const brandOptions    = fetchedBrandOptions.length    ? fetchedBrandOptions    : [];
  const categoryOptions = fetchedCategoryOptions.length ? fetchedCategoryOptions : [];

  const handleCategorySelect = (value) => {
    const option = categoryOptions.find((o) => String(o.value) === String(value));
    setCategoryId(String(value));
    setCategoryName(option?.label || value);
    markDirty();
  };

  const handleBrandSelect = (value) => {
    const option = brandOptions.find((o) => String(o.value) === String(value));
    setBrandId(String(value));
    setBrandName(option?.label || value);
    markDirty();
  };

  // ── Attribute creation handlers ─────────────────────────────────
  const handleCreateValue = (payload) => {
    if (payload?.attribute_id && payload?.attribute_value_id) {
      setAttributeSelections((current) => ({
        ...current,
        [String(payload.attribute_id)]: String(payload.attribute_value_id),
      }));
      markDirty();
    }
    setCreateValueFor(null);
    setRefreshKey((k) => k + 1);
  };

  // ── Save product fields only ──────────────────────────────────
  const handleSave = async () => {
    if (!name.trim())  { alert("Product name is required."); return; }
    if (!sellingPrice) { alert("Selling price is required."); return; }
    if (Number(discPrice) > Number(sellingPrice)) {
      alert("Discounted price cannot exceed selling price.");
      return;
    }

    const remainingImages = images.filter(img => !pendingImageRemoves.includes(img.image_id));
    if (remainingImages.length + pendingImageAdds.length > 3) {
      alert("Total images cannot exceed 3.");
      return;
    }

    setSaving(true);

    const normalizedAttributes = (Array.isArray(catalogAttributes) ? catalogAttributes : [])
      .map((attribute) => {
        const selectedValue = attributeSelections[String(attribute.attribute_id)];
        const matchedValue  = (attribute.values || []).find((value) =>
          String(value.attribute_value_id) === String(selectedValue) ||
          String(value.value)              === String(selectedValue)
        );
        return matchedValue?.attribute_value_id
          ? { attribute_id: Number(attribute.attribute_id), attribute_value_id: Number(matchedValue.attribute_value_id) }
          : null;
      })
      .filter((attr) =>
        attr &&
        Number.isInteger(attr.attribute_id)       && attr.attribute_id > 0 &&
        Number.isInteger(attr.attribute_value_id) && attr.attribute_value_id > 0
      );

    const payload = {
      product_id:       Number(productId),
      name:             name        || undefined,
      description:      description || undefined,
      brand_id:         brandId     ? Number(brandId)    : undefined,
      brand_name:       brandName   || undefined,
      category_id:      categoryId  ? Number(categoryId) : undefined,
      category_name:    !categoryId ? categoryName || undefined : undefined,
      base_price:       basePrice       !== "" ? Number(basePrice)       : undefined,
      selling_price:    sellingPrice    !== "" ? Number(sellingPrice)    : undefined,
      discounted_price: discPrice       !== "" ? Number(discPrice)       : undefined,
      stock_quantity:   stockQty        !== "" ? Number(stockQty)        : undefined,
      warranty_months:  warrantyMonths  === "" || warrantyMonths === null ? null : Number(warrantyMonths),
    };

    if (normalizedAttributes.length) payload.attributes = normalizedAttributes;

    try {
      await updateDetails(productId, payload);
      // Apply deferred image removes
      for (const imageId of pendingImageRemoves) {
        await removeImageApi(productId, imageId);
      }

      // Apply deferred image adds
      let updatedImages = images.filter(img => !pendingImageRemoves.includes(img.image_id));
      if (pendingImageAdds.length > 0) {
        const added = await addImages(productId, pendingImageAdds);
        updatedImages = [...updatedImages, ...added.map((img, i) => ({ ...img, _key: img.image_id ?? i }))];
      }

      setImages(updatedImages);
      setPendingImageAdds([]);
      setPendingImageRemoves([]);
      setSaved(true);
      setDirty(false);
      onSave();
    } catch (error) {
      const body    = error?.cause?.body ?? error?.body ?? error?.response?.data;
      const message = body?.message || error?.message || "Failed to update product";
      console.error("Product update failed:", error);
      alert(`Failed to update product: ${message}`);
    } finally {
      setSaving(false);
    }
  };

  const discPriceError = discPrice && Number(discPrice) > Number(sellingPrice);

  const attributeOptionsById = (Array.isArray(catalogAttributes) ? catalogAttributes : []).reduce((acc, attribute) => {
    acc[String(attribute.attribute_id)] = [
      { value: "", label: "Select value" },
      ...(Array.isArray(attribute.values)
        ? attribute.values.map((value) => ({
            value: String(value.attribute_value_id),
            label: value.value || String(value.attribute_value_id),
          }))
        : []),
    ];
    return acc;
  }, {});

  if (!sourceProduct && detailLoading) return <LoadingState />;
  if (!sourceProduct && detailError)   return <NotFoundState error={detailError} onBack={() => navigate("/admin/products")} />;

  return (
    <div className="h-full overflow-y-auto bg-[#f5f5f5] p-5 lg:p-6">
      {showDiscard && (
        <DiscardModal
          onConfirm={() => { setShowDiscard(false); navigate("/admin/products"); }}
          onCancel={() => setShowDiscard(false)}
        />
      )}

      {/* ── Attribute creation overlays ── */}
      {showAttrCreate && (
        <AttributeCreateOverlay
          categories={categoryList || []}
          defaultCategoryId={productCategoryId ? Number(productCategoryId) : ""}
          onCreated={() => {
            setShowAttrCreate(false);
            setRefreshKey((k) => k + 1);
          }}
          onClose={() => setShowAttrCreate(false)}
        />
      )}
      {createValueFor && (
        <CreateAttributeValueOverlay
          attribute={createValueFor}
          onSave={handleCreateValue}
          onClose={() => setCreateValueFor(null)}
        />
      )}

      <EditProductHeader
        productId={productId}
        dirty={dirty}
        saved={saved}
        saving={saving}
        updateLoading={updateLoading}
        onBack={() => navigate("/admin/products")}
        onSave={handleSave}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 flex flex-col gap-5">
          <ProductBasicsSection
            name={name}
            onNameChange={(val) => { setName(val); markDirty(); }}
            description={description}
            onDescriptionChange={(val) => { setDescription(val); markDirty(); }}
            brandId={brandId}
            brandOptions={brandOptions}
            onBrandChange={handleBrandSelect}
            categoryId={categoryId}
            categoryOptions={categoryOptions}
            onCategoryChange={handleCategorySelect}
          />

          {/* ── Images: independent, instant API calls ── */}
          <ProductImagesSection
            productId={productId}
            images={images}
            onImagesChange={setImages}
            reorderImages={reorderImages}
            reorderImagesLoading={reorderImagesLoading}
            pendingAdds={pendingImageAdds}
            onPendingAddsChange={(files) => { setPendingImageAdds(files); markDirty(); }}
            pendingRemoves={pendingImageRemoves}
            onPendingRemovesChange={(ids) => { setPendingImageRemoves(ids); markDirty(); }}
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
            onAddAttribute={() => setShowAttrCreate(true)}
            onAddValue={(attribute) => setCreateValueFor(attribute)}
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
                { label: "Brand",      value: brandName    || brandId    || "—" },
                { label: "Category",   value: categoryName || categoryId || "—" },
                { label: "Images",     value: `${images.length} / 3` },
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