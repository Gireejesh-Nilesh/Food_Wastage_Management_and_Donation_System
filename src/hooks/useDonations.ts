import { useState, useEffect } from "react";
import { getDonations, createDonation } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export const useDonations = () => {
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const { data, error } = await getDonations();
      if (error) throw error;
      setDonations(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addDonation = async (donationData: any) => {
    if (!user) throw new Error("User not authenticated");

    try {
      const { data, error } = await createDonation({
        ...donationData,
        donor_id: user.id,
      });
      if (error) throw error;

      // Refresh donations list
      await fetchDonations();
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err.message };
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  return {
    donations,
    loading,
    error,
    addDonation,
    refetch: fetchDonations,
  };
};
