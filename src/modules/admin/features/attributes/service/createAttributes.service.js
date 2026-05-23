import { createAttribute } from "../api/attributes.api";

export const createAttributeService = async (attributeData) => {
    try{
        const res = await createAttribute(attributeData);
        return res;
    } catch (error) {
        const err = new Error(error.message || "Failed to create attribute");
        err.cause = error;
        throw err;
    }
}