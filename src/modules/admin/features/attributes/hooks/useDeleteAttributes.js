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
            const deleteAttribute = await deleteAttributesService(id);
            setSuccess(true);
            return deleteAttribute;
        } catch(err){
            const message = err.message || "Failed to delete Brand";
            setError(message)
        } finally{
            setLoading(true);
        }
    }
    return { loading, error, success, deleteAttribute}
}