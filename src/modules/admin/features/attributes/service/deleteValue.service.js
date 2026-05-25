import { deleteAttributeValue } from "../api/attributes.api";
import { handleApiError } from "../../../../../utils/apiError";

export const deleteValueService = async (attributeId, attributeValueId) => {
    try {
        const res = await deleteAttributeValue(attributeId, attributeValueId);
        return res;
    } catch (err) {
        throw handleApiError(err, "Failed to delete attribute value");
    }
};
