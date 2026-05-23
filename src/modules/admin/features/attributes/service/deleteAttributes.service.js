import { deleteAttribute } from "../api/attributes.api";
import { handleApiError } from "../../../../../utils/apiError";


export const deleteAttributesService = async (id) => {
    try{
        const res = await deleteAttribute(id);
        return res;
    }catch (err) {
        throw handleApiError(err, "Failed to delete attribute");
    }
}