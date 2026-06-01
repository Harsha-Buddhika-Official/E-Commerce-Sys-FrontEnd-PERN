import API from "../../../../../api/client";
import { handleApiError } from "../../../../../utils/apiError";

export const createAttribute = async (attributeData) => {
     try{
        const res = await API.post("/attributes", attributeData);
        return res.data;
     } catch (error) {
        throw handleApiError(error, "Failed to create attribute");
     }
}

export const createAttributeValue = async (attributeId, valueData) => {
  try {
    const res = await API.post(`/attributes/${attributeId}/value`, valueData);
    return res.data;
  } catch (err) {
    throw handleApiError(err, "Failed to create attribute value");
  }
};

// get all attributes with their values devided into categories for attribute page 
export const fetchAttributesCatalog = async () => {
  try {
    const res = await API.get("/attributes");
    return res.data;
  } catch (error) {
    throw handleApiError(error, "Failed to fetch attributes catalog");
  }
};

export const deleteAttribute = async(attributeId) => {
  try{
    const res = await API.delete(`/attributes/${attributeId}`);;
    return res.data;
  } catch (err) {
    throw handleApiError(err, "Failed to delete attribute");
  }
}

export const deleteAttributeValue = async (attributeId, attributeValueId) => {
  try {
    const res = await API.delete(`/attributes/${attributeId}/value/${attributeValueId}`);
    return res.data;
  } catch (err) {
    throw handleApiError(err, "Failed to delete attribute value");
  }
};