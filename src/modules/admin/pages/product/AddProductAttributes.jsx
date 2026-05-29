import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import { useProductAttributes } from "../../features/products/hooks/useProductAttributes.js";
import { addAttributeToProduct } from "../../features/products/service/products.service.js";
import AttributeCreateOverlay from "../../overlay/AttributeCreateOverlay.jsx";
import CreateAttributeValueOverlay from "../../overlay/CreateAttributeValueOverlay.jsx";
import { useCategories } from "../../features/categories/hooks/useCategories.js";
import {
  ErrorBanner,
  FieldLabel,
  PreviewRow,
  SectionCard,
  SectionHeader,
  SelectField,
  TextField,
  formatLabel,
  normalizeAttributes,
  INTER,
  SORA,
} from "./components/AddProductUi.jsx";

const AddProductAttributes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};

  const productId = state.productId ?? state.product?.product_id ?? state.product?.id ?? null;
  const categoryId = state.categoryId ?? state.product?.category_id ?? "";
  const categoryName = state.categoryName ?? state.product?.category_name ?? "";

  const [attributeSelections, setAttributeSelections] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});
  const [showAttrCreate, setShowAttrCreate] = useState(false);
  const [createValueFor, setCreateValueFor] = useState(null);

  const normalizedCategoryId = categoryId === "" || categoryId === null || typeof categoryId === "undefined"
    ? ""
    : Number(categoryId);
  const { attributes: rawAttributes, loading: attributesLoading, error: attributesError } = useProductAttributes(normalizedCategoryId);
  const attributes = useMemo(() => normalizeAttributes(rawAttributes), [rawAttributes]);
  const { categories } = useCategories();

  useEffect(() => {
    if (!productId || !normalizedCategoryId) {
      navigate("/admin/products/add", { replace: true });
    }
  }, [navigate, normalizedCategoryId, productId]);

  useEffect(() => {
    setAttributeSelections({});
  }, [categoryId]);

  const handleCancel = () => {
    navigate("/admin/products/add", {
      state: {
        productId,
        categoryId: normalizedCategoryId,
        categoryName,
        product: state.product,
      },
    });
  };

  const handleCreateValue = () => {
    setCreateValueFor(null);
    window.location.reload();
  };

  const handleSaveAttributes = async () => {
    if (!productId) {
      setErrors({ form: "Missing product id." });
      return;
    }

    setSaving(true);
    setSaved(false);
    try {
      const selectedAttributes = Object.entries(attributeSelections).filter(([, value]) => value !== null && value !== "");
      const attachCalls = [];
      const skipped = [];

      selectedAttributes.forEach(([attributeId, selectedValue]) => {
        const matchedAttribute = attributes.find((attribute) => String(attribute.attribute_id) === String(attributeId));
        const matchedValue = matchedAttribute?.values?.find(
          (entry) => String(entry.attribute_value_id) === String(selectedValue) || String(entry.value) === String(selectedValue),
        );

        if (matchedValue?.attribute_value_id) {
          attachCalls.push(
            addAttributeToProduct(productId, {
              attribute_id: Number(attributeId),
              attribute_value_id: Number(matchedValue.attribute_value_id),
            }),
          );
        } else {
          skipped.push(Number(attributeId));
        }
      });

      if (attachCalls.length > 0) {
        await Promise.allSettled(attachCalls);
      }

      if (skipped.length > 0) {
        setErrors((current) => ({
          ...current,
          form: `Some attributes were skipped because an existing attribute value was not selected: ${skipped.join(", ")}. Create/select attribute values first.`,
        }));
      }

      setSaved(true);
      setTimeout(() => navigate("/admin/products"), 600);
    } catch (error) {
      setErrors((current) => ({ ...current, form: error?.message || "Failed to save attributes." }));
    } finally {
      setSaving(false);
    }
  };

  const selectedAttrCount = Object.values(attributeSelections).filter(Boolean).length;

  return (
    <main className="h-full overflow-y-auto bg-[#f5f5f5] px-5 py-6 lg:px-6 lg:py-7">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button
          onClick={handleCancel}
          className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-all cursor-pointer shrink-0"
        >
          <ArrowBackOutlinedIcon style={{ fontSize: 18 }} />
        </button>
        <div className="min-w-0">
          <p style={{ ...INTER, fontSize: 11, color: "#aaa", fontWeight: 500 }}>Catalogue / Products</p>
          <h1 style={{ ...SORA, fontSize: 22, fontWeight: 900, color: "#111", letterSpacing: "-0.3px" }}>Product Attributes</h1>
        </div>
        <div className="ml-auto flex items-center gap-2.5">
          <button
            onClick={() => setShowAttrCreate(true)}
            className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-all cursor-pointer"
            style={{ ...INTER, fontSize: 13, fontWeight: 600 }}
          >
            Add Attribute
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-all cursor-pointer"
            style={{ ...INTER, fontSize: 13, fontWeight: 600 }}
          >
            Back
          </button>
          <button
            onClick={handleSaveAttributes}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white transition-all disabled:opacity-60 cursor-pointer"
            style={{ ...SORA, fontSize: 13, fontWeight: 700, backgroundColor: saved ? "#16a34a" : "#111", border: "none" }}
          >
            {saving ? (
              <><span className="w-4 h-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Saving…</>
            ) : saved ? (
              <><CheckCircleOutlinedIcon style={{ fontSize: 16 }} />Saved!</>
            ) : (
              <><SaveOutlinedIcon style={{ fontSize: 16 }} />Save Attributes</>
            )}
          </button>
        </div>
      </div>

      {/* Overlays */}
      {showAttrCreate && (
        <AttributeCreateOverlay
          categories={categories || []}
          defaultCategoryId={normalizedCategoryId}
          onCreated={() => {
            setShowAttrCreate(false);
            // refresh attributes to show newly created attribute
            window.location.reload();
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

      {(errors.form || attributesError) && (
        <div className="flex flex-col gap-3 mb-5">
          {errors.form && <ErrorBanner title="Unable to save attributes" message={errors.form} />}
          {attributesError && <ErrorBanner title="Attributes could not be loaded" message={attributesError} />}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 flex flex-col gap-5">
          <SectionCard>
            <SectionHeader icon={<CategoryOutlinedIcon style={{ fontSize: 18 }} />} title="Category Attributes" subtitle={categoryName || "Select a category first"} />
            <div className="p-6">
              {!normalizedCategoryId ? (
                <div className="flex flex-col items-center justify-center py-8 rounded-xl border border-dashed border-gray-200" style={{ backgroundColor: "#fafafa" }}>
                  <CategoryOutlinedIcon style={{ fontSize: 32, color: "#ddd", marginBottom: 8 }} />
                  <p style={{ ...INTER, fontSize: 12, fontWeight: 600, color: "#bbb" }}>No category selected.</p>
                </div>
              ) : attributesLoading ? (
                <div className="flex items-center justify-center py-8 rounded-xl bg-[#fafafa] border border-dashed border-gray-200">
                  <span className="w-5 h-5 animate-spin rounded-full border-2 border-gray-200 border-t-gray-500 mr-2" />
                  <p style={{ ...INTER, fontSize: 12, fontWeight: 600, color: "#aaa" }}>Loading attributes…</p>
                </div>
              ) : attributes.length === 0 ? (
                <div className="flex flex-col items-center py-8 rounded-xl bg-[#fafafa] border border-dashed border-gray-200">
                  <p style={{ ...INTER, fontSize: 12, fontWeight: 600, color: "#bbb" }}>No attributes for this category.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {attributes.map((attribute) => (
                    <div key={attribute.attribute_id} className="rounded-xl border border-gray-200 bg-white p-4">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <FieldLabel>{attribute.name}</FieldLabel>
                        <button
                          type="button"
                          onClick={() => setCreateValueFor(attribute)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-gray-600 hover:bg-gray-50 transition-all cursor-pointer"
                          style={{ ...INTER, fontSize: 12, fontWeight: 600 }}
                        >
                          <AddOutlinedIcon style={{ fontSize: 15 }} /> Add Value
                        </button>
                      </div>
                      {attribute.values.length > 0 ? (
                        <SelectField
                          value={attributeSelections[attribute.attribute_id] || ""}
                          onChange={(value) => setAttributeSelections((current) => ({ ...current, [attribute.attribute_id]: value }))}
                          options={attribute.values.map((value) => ({ value: String(value.attribute_value_id), label: value.value || formatLabel(value.attribute_value_id) }))}
                          placeholder="Select value"
                        />
                      ) : (
                        <TextField
                          value={attributeSelections[attribute.attribute_id] || ""}
                          onChange={(value) => setAttributeSelections((current) => ({ ...current, [attribute.attribute_id]: value }))}
                          placeholder={`Enter ${attribute.name.toLowerCase()}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </SectionCard>
        </div>

        <div className="flex flex-col gap-5">
          <SectionCard>
            <SectionHeader icon={<InventoryOutlinedIcon style={{ fontSize: 18 }} />} title="Summary" subtitle="Quick form overview" />
            <div className="px-6 py-4">
              <PreviewRow label="Category" value={categoryName} />
              <PreviewRow label="Attributes" value={selectedAttrCount > 0 ? `${selectedAttrCount} selected` : "0 selected"} />
            </div>
          </SectionCard>
        </div>
      </div>
    </main>
  );
};

export default AddProductAttributes;
