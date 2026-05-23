import API from "../../../../../api/client";
import { handleApiError } from "../../../../../utils/apiError";

export const fetchAttributesCatalog = async () => {
  try {
    const res = await API.get("/attributes");
    return res.data;
  } catch (error) {
    throw handleApiError(error, "Failed to fetch attributes catalog");
  }
};

export const createAttribute = async (attributeData) => {
     try{
        const res = await API.post("/attributes", attributeData);
        console.log(attributeData);
        return res.data;
     } catch (error) {
        throw handleApiError(error, "Failed to create attribute");
     }
}

export const deleteAttribute = async(attributeId) => {
  try{
    const res = await API.delete(`/attributes/${attributeId}`);
    return res.data;
  } catch (err) {
    throw handleApiError(err, "Failed to delete attribute");
  }
}