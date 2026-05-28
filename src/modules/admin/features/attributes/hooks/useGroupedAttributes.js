import { useEffect, useState } from "react";
import { getGroupedAttributes } from "../service/groupedAttributes.service";

export const useGroupedAttributes = () => {
  const [groups, setGroups] = useState([]);
  const [categories, setCategories] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGroupedCatalog = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getGroupedAttributes();
      setGroups(data.groups || []);
      setCategories(data.categories || []);
      setAttributes(data.attributes || []);
    } catch (err) {
      setGroups([]);
      setCategories([]);
      setAttributes([]);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadGroupedCatalog = async () => {
      await fetchGroupedCatalog();
    };

    void loadGroupedCatalog();
  }, []);

  return {
    groups,
    categories,
    attributes,
    loading,
    error,
    refresh: fetchGroupedCatalog,
  };
};
