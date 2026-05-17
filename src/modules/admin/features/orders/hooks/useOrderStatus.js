import { getOrderStatusCounts } from "../service/orderStatus.service";
import { useEffect,useState } from "react";

export  const useOrderStatus = () => {
    const [orderStatus, setOrderStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await getOrderStatusCounts();
                setOrderStatus(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    return { orderStatus, loading, error };
}