import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const signUp = async (
  email: string,
  password: string,
  userData: any,
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  return { user, error };
};

// Database helpers
export const createProfile = async (profile: any) => {
  const { data, error } = await supabase
    .from("profiles")
    .insert(profile)
    .select()
    .single();
  return { data, error };
};

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  return { data, error };
};

export const createDonation = async (donation: any) => {
  const { data, error } = await supabase
    .from("donations")
    .insert(donation)
    .select()
    .single();
  return { data, error };
};

export const getDonations = async () => {
  const { data, error } = await supabase
    .from("donations")
    .select(
      `
      *,
      profiles:donor_id (
        full_name,
        phone
      )
    `,
    )
    .eq("status", "available")
    .order("created_at", { ascending: false });
  return { data, error };
};

export const createRequest = async (request: any) => {
  const { data, error } = await supabase
    .from("requests")
    .insert(request)
    .select()
    .single();
  return { data, error };
};

export const getUserRequests = async (userId: string) => {
  const { data, error } = await supabase
    .from("requests")
    .select(
      `
      *,
      donations (
        title,
        food_type,
        pickup_address
      )
    `,
    )
    .eq("receiver_id", userId)
    .order("created_at", { ascending: false });
  return { data, error };
};

export const updateRequestStatus = async (
  requestId: string,
  status: string,
) => {
  const { data, error } = await supabase
    .from("requests")
    .update({ status })
    .eq("id", requestId)
    .select()
    .single();
  return { data, error };
};

// File upload helper
export const uploadFile = async (file: File, bucket: string, path: string) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file);

  if (error) return { data: null, error };

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path);

  return { data: { path: data.path, publicUrl }, error: null };
};
