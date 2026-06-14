import API from "../../../../../api/client";

// Create a new attribute (attribute page)
export const createAttribute = async (attributeData) => {
    const res = await API.post("/attributes/admin", attributeData);
    return res.data;
}

// Create a new value for a specific attribute (attribute page)
export const createAttributeValue = async (attributeId, valueData) => {
    const res = await API.post(`/attributes/admin/${attributeId}/value`, valueData);
    return res.data;
};

// get all attributes with their values devided into categories (attribute page) 
export const fetchAttributesCatalog = async () => {
    const res = await API.get("/attributes/admin");
    return res.data;
};

// for delete attribute (attribute page)
export const deleteAttribute = async(attributeId) => {
    const res = await API.delete(`/attributes/admin/${attributeId}`);
    return res.data;
}

// for delete attribute value (attribute page)
export const deleteAttributeValue = async (attributeId, attributeValueId) => {
    const res = await API.delete(`/attributes/admin/${attributeId}/value/${attributeValueId}`);
    return res.data;
};