import { deleteAttributesService } from "../service/deleteAttributes.service";
import { useState } from "react";

export const useDeleteAttributes = () => {
    const[loading, setLoading] = useState(false);
    const[error, setError] = useState(null);
    const[success, setSuccess] = useState(false)

    const deleteAttribute = async(id) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try{
            const deletedAttribute = await deleteAttributesService(id);
            setSuccess(true);
            return deletedAttribute;
        } catch(err){
            const message = err.message || "Failed to delete attribute.";
            setError(message)
            throw err;
        } finally{
            setLoading(false);
        }
    }
    return { loading, error, success, deleteAttribute}
}