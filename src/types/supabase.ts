export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          address: string | null;
          user_type: "donor" | "receiver" | "both" | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          address?: string | null;
          user_type?: "donor" | "receiver" | "both" | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          phone?: string | null;
          address?: string | null;
          user_type?: "donor" | "receiver" | "both" | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      donations: {
        Row: {
          id: string;
          donor_id: string;
          title: string;
          description: string | null;
          food_type: string;
          quantity: string;
          pickup_address: string;
          image_url: string | null;
          status:
            | "available"
            | "reserved"
            | "picked_up"
            | "completed"
            | "cancelled";
          expiry_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          donor_id: string;
          title: string;
          description?: string | null;
          food_type: string;
          quantity: string;
          pickup_address: string;
          image_url?: string | null;
          status?:
            | "available"
            | "reserved"
            | "picked_up"
            | "completed"
            | "cancelled";
          expiry_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          donor_id?: string;
          title?: string;
          description?: string | null;
          food_type?: string;
          quantity?: string;
          pickup_address?: string;
          image_url?: string | null;
          status?:
            | "available"
            | "reserved"
            | "picked_up"
            | "completed"
            | "cancelled";
          expiry_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      requests: {
        Row: {
          id: string;
          receiver_id: string;
          donation_id: string | null;
          requested_items: string[];
          delivery_address: string;
          service_type: "self_service" | "platform_service";
          status:
            | "pending"
            | "approved"
            | "in_transit"
            | "delivered"
            | "cancelled";
          payment_status: "pending" | "paid" | "failed";
          payment_amount: number | null;
          delivery_boy_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          receiver_id: string;
          donation_id?: string | null;
          requested_items: string[];
          delivery_address: string;
          service_type: "self_service" | "platform_service";
          status?:
            | "pending"
            | "approved"
            | "in_transit"
            | "delivered"
            | "cancelled";
          payment_status?: "pending" | "paid" | "failed";
          payment_amount?: number | null;
          delivery_boy_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          receiver_id?: string;
          donation_id?: string | null;
          requested_items?: string[];
          delivery_address?: string;
          service_type?: "self_service" | "platform_service";
          status?:
            | "pending"
            | "approved"
            | "in_transit"
            | "delivered"
            | "cancelled";
          payment_status?: "pending" | "paid" | "failed";
          payment_amount?: number | null;
          delivery_boy_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      delivery_personnel: {
        Row: {
          id: string;
          name: string;
          phone: string;
          status: "available" | "busy" | "offline";
          current_location: unknown | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone: string;
          status?: "available" | "busy" | "offline";
          current_location?: unknown | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string;
          status?: "available" | "busy" | "offline";
          current_location?: unknown | null;
          created_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          request_id: string;
          amount: number;
          payment_method: string | null;
          transaction_id: string | null;
          status: "pending" | "completed" | "failed" | "refunded";
          created_at: string;
        };
        Insert: {
          id?: string;
          request_id: string;
          amount: number;
          payment_method?: string | null;
          transaction_id?: string | null;
          status?: "pending" | "completed" | "failed" | "refunded";
          created_at?: string;
        };
        Update: {
          id?: string;
          request_id?: string;
          amount?: number;
          payment_method?: string | null;
          transaction_id?: string | null;
          status?: "pending" | "completed" | "failed" | "refunded";
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
