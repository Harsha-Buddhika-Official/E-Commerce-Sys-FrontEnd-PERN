import API from "../../../../../api/client";
import { handleApiError } from "../../../../../utils/apiError";

// Create a new attribute
export const createAttribute = async (attributeData) => {
     try{
        const res = await API.post("/attributes/admin", attributeData);
        return res.data;
     } catch (error) {
        throw handleApiError(error, "Failed to create attribute");
     }
}

// Create a new value for a specific attribute
export const createAttributeValue = async (attributeId, valueData) => {
  try {
    const res = await API.post(`/attributes/admin/${attributeId}/value`, valueData);
    return res.data;
  } catch (err) {
    throw handleApiError(err, "Failed to create attribute value");
  }
};

// get all attributes with their values devided into categories for attribute page 
export const fetchAttributesCatalog = async () => {
  try {
    const res = await API.get("/attributes/admin");
    return res.data;
  } catch (error) {
    throw handleApiError(error, "Failed to fetch attributes catalog");
  }
};

// for delete attribute in attribute page
export const deleteAttribute = async(attributeId) => {
  try{
    const res = await API.delete(`/attributes/admin/${attributeId}`);;
    return res.data;
  } catch (err) {
    throw handleApiError(err, "Failed to delete attribute");
  }
}

// for delete attribute value in attribute page
export const deleteAttributeValue = async (attributeId, attributeValueId) => {
  try {
    const res = await API.delete(`/attributes/admin/${attributeId}/value/${attributeValueId}`);
    return res.data;
  } catch (err) {
    throw handleApiError(err, "Failed to delete attribute value");
  }
};