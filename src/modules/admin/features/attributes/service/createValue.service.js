import { createAttributeValue as createAttributeValueApi } from "../api/attributes.api";

export const createAttributeValueService = async (attributeId, valueData) => {
    try {
        const newValue = await createAttributeValueApi(attributeId, valueData);
        return newValue;
    } catch (err) {
        console.error("Failed to create attribute value:", err);
        throw err;
    }
};