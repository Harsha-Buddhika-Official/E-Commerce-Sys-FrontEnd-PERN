import API from "../../../../../api/client";
import { handleApiError } from "../../../../../utils/apiError";

const slugify = (str) =>
  String(str || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const normalizeValue = (value) => ({
  attribute_value_id: Number(value.attribute_value_id),
  value: value.value || "",
  slug: value.slug || slugify(value.value),
  created_at: value.created_at || null,
});

const normalizeAttribute = (attribute, categoryId) => ({
  attribute_id: Number(attribute.attribute_id),
  name: attribute.name || "",
  category_id: Number(categoryId),
  values: Array.isArray(attribute.values) ? attribute.values.map(normalizeValue) : [],
});

const normalizeGroup = (group) => {
  const categoryId = Number(group.category_id);
  const attributes = Array.isArray(group.attributes)
    ? group.attributes
        .filter((attribute) => attribute && typeof attribute === "object")
        .map((attribute) => normalizeAttribute(attribute, categoryId))
        .sort((a, b) => a.name.localeCompare(b.name))
    : [];

  return {
    category_id: categoryId,
    category_name: group.category_name || group.name || "",
    attributes,
  };
};

export const getGroupedAttributes = async () => {
  try {
    const response = await API.get("/attributes/grouped");
    const payload = Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response?.data?.data)
        ? response.data.data
        : Array.isArray(response)
          ? response
          : [];

    const groups = payload
      .filter((group) => group && typeof group === "object")
      .map(normalizeGroup)
      .sort((a, b) => a.category_id - b.category_id);

    const categories = groups.map((group) => ({
      category_id: group.category_id,
      name: group.category_name,
    }));

    const attributes = groups
      .flatMap((group) => group.attributes)
      .sort((a, b) => a.category_id - b.category_id || a.name.localeCompare(b.name));

    return {
      groups,
      categories,
      attributes,
    };
  } catch (error) {
    throw handleApiError(error, "Failed to fetch grouped attributes");
  }
};
