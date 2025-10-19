import { useState, useEffect } from "react";
import {
  getUserRequests,
  createRequest,
  updateRequestStatus,
} from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export const useRequests = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchRequests = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await getUserRequests(user.id);
      if (error) throw error;
      setRequests(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addRequest = async (requestData: any) => {
    if (!user) throw new Error("User not authenticated");

    try {
      const { data, error } = await createRequest({
        ...requestData,
        receiver_id: user.id,
      });
      if (error) throw error;

      // Refresh requests list
      await fetchRequests();
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err.message };
    }
  };

  const updateStatus = async (requestId: string, status: string) => {
    try {
      const { data, error } = await updateRequestStatus(requestId, status);
      if (error) throw error;

      // Update local state
      setRequests((prev) =>
        prev.map((req) => (req.id === requestId ? { ...req, status } : req)),
      );
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err.message };
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [user]);

  return {
    requests,
    loading,
    error,
    addRequest,
    updateStatus,
    refetch: fetchRequests,
  };
};
