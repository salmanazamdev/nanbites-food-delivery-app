import { supabase } from "@/lib/supabase";

export type Order = {
  id: string;
  user_id: string;
  restaurant_id: string;
  address_id: string;
  total_amount: number;
  delivery_fee: number;
  payment_method: string;
  status: string;
  order_number: string;
  created_at: string;
  updated_at: string;
};

export const orderService = {
  async createOrder(orderData: Omit<Order, "id" | "order_number" | "created_at" | "updated_at">) {
    const { data, error } = await supabase
      .from("orders")
      .insert(orderData)
      .select()
      .single();

    return { data, error };
  },

  async getOrdersByUser(userId: string): Promise<{ data: Order[]; error: any }> {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    return { data: data || [], error };
  },

  async getOrderById(orderId: string): Promise<{ data: Order | null; error: any }> {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    return { data, error };
  },

  async updateOrderStatus(orderId: string, status: string) {
    const { data, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId)
      .select()
      .single();

    return { data, error };
  },
};
