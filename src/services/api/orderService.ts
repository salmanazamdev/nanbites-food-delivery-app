import { supabase } from "@/lib/supabase";

export type Discount = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  discount_percent: number;
  valid_until: string;
  is_active: boolean;
};

export const discountService = {
  async getActiveDiscounts(): Promise<{ data: Discount[]; error: any }> {
    const { data, error } = await supabase
      .from("discounts")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    return { data: data || [], error };
  },
};
