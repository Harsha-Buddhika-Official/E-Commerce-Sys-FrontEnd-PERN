import { useState, useEffect } from "react";
import { fetchAllAdmins } from "../service/getAdmins.service";

export const useGetAdmins = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAdmins = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchAllAdmins();
            setAdmins(data);
        } catch (err) {
            setError(err.message || "Failed to fetch admins");
            setAdmins([]);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchAdmins();
    }, []); // Refetch admins when a role update succeeds

    return {
        admins,
        loading,
        error,
        refresh: fetchAdmins,
    }
};