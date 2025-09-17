import { supabase } from "@/lib/supabase";

// =======================
// Interfaces
// =======================
export interface Category {
  id: string;
  category_name: string;
  category_description: string;
  image_url?: string;
}

export interface Restaurant {
  id: string;
  restaurant_name: string;
  address: string;
  phone: string;
  email: string;
  category_id: string;
  image_url?: string;
  rating: number;
  total_reviews: number;
  delivery_fee: number;
  minimum_order: number;
  delivery_time: string;
  is_open: boolean;
  is_featured: boolean;
  category?: Category;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  is_vegetarian: boolean;
  is_popular: boolean;
  is_available: boolean;
}

export interface CartItem {
  id: string;
  user_id: string;
  menu_item_id: string;
  restaurant_id: string;
  quantity: number;
  price: number;
  total_price: number;
  note?: string;
  menu_item?: MenuItem;
  restaurant?: Restaurant;
}

// =======================
// Restaurant Service
// =======================
class RestaurantService {
  async getCategories() {
    return await supabase.from("categories").select("*").order("category_name", { ascending: true });
  }

  async getFeaturedRestaurants() {
    return await supabase
      .from("restaurants")
      .select(`*, category:categories(*)`)
      .eq("is_featured", true)
      .eq("is_open", true)
      .order("rating", { ascending: false })
      .limit(10);
  }

  async getRestaurantsByCategory(categoryId: string) {
    return await supabase
      .from("restaurants")
      .select(`*, category:categories(*)`)
      .eq("category_id", categoryId)
      .eq("is_open", true)
      .order("rating", { ascending: false });
  }

  async searchRestaurants(query: string) {
    return await supabase
      .from("restaurants")
      .select(`*, category:categories(*)`)
      .or(`restaurant_name.ilike.%${query}%,address.ilike.%${query}%`)
      .eq("is_open", true)
      .order("rating", { ascending: false });
  }

  async getRestaurantById(id: string) {
    return await supabase
      .from("restaurants")
      .select(`*, category:categories(*), menu_items(*)`)
      .eq("id", id)
      .single();
  }

  async getMenuItems(restaurantId: string) {
    return await supabase
      .from("menu_items")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .eq("is_available", true)
      .order("is_popular", { ascending: false })
      .order("name", { ascending: true });
  }

  async getMenuItemById(itemId: string) {
    return await supabase.from("menu_items").select("*").eq("id", itemId).single();
  }

  async getAllRestaurants() {
    return await supabase
      .from("restaurants")
      .select(`*, category:categories(*)`)
      .eq("is_open", true)
      .order("rating", { ascending: false })
      .limit(20);
  }

  async addToFavorites(restaurantId: string) {
    return await supabase.from("user_favorites").insert({ restaurant_id: restaurantId });
  }

  async removeFromFavorites(restaurantId: string) {
    return await supabase.from("user_favorites").delete().eq("restaurant_id", restaurantId);
  }

  async isFavorite(restaurantId: string) {
    const { data, error } = await supabase.from("user_favorites").select("id").eq("restaurant_id", restaurantId).single();
    return { data: !!data, error: error?.code === "PGRST116" ? null : error };
  }

  async getUserFavorites() {
    const { data, error } = await supabase
      .from("user_favorites")
      .select(`restaurant:restaurants(*, category:categories(*))`);

    if (error) return { data: null, error };
    const restaurants = data?.map((item) => item.restaurant).filter(Boolean) || [];
    return { data: restaurants as Restaurant[], error: null };
  }
}

export const restaurantService = new RestaurantService();

// =======================
// Cart Service (One Restaurant Only)
// =======================
class CartService {
  // Add to Cart (enforces single-restaurant rule)
  async addToCart(
    menuItemId: string,
    restaurantId: string,
    quantity: number = 1,
    note?: string
  ) {
    // get current user
    const { data: authData } = await supabase.auth.getUser();
    const user = authData?.user;
    if (!user) return { data: null, error: "Not logged in" };

    // get menu item price (and verify restaurant_id if you want)
    const { data: menuItemData, error: menuError } = await supabase
      .from("menu_items")
      .select("price, restaurant_id")
      .eq("id", menuItemId)
      .single();

    if (menuError) return { data: null, error: menuError };
    const price = Number(menuItemData?.price ?? 0);
    const totalPrice = price * quantity;

    // fetch existing cart items for user
    const { data: existingCart, error: cartFetchError } = await supabase
      .from("cart_items")
      .select("id, menu_item_id, restaurant_id, quantity, price, total_price")
      .eq("user_id", user.id);

    if (cartFetchError) return { data: null, error: cartFetchError };

    // If cart has items from a different restaurant -> block (single-restaurant rule)
    const restaurantIds = Array.isArray(existingCart)
      ? [...new Set(existingCart.map((c: any) => c.restaurant_id).filter(Boolean))]
      : [];

    if (
      restaurantIds.length > 0 &&
      // allow if the only restaurant in cart is the same as the one we are adding
      !(restaurantIds.length === 1 && restaurantIds[0] === restaurantId)
    ) {
      return { data: null, error: "DIFFERENT_RESTAURANT" };
    }

    // find existing item (same menu_item_id)
    const existingItem = Array.isArray(existingCart)
      ? existingCart.find((i: any) => i.menu_item_id === menuItemId)
      : null;

    if (existingItem) {
      // update existing cart item quantity + total_price
      const newQty = Number(existingItem.quantity) + Number(quantity);
      const { data, error } = await supabase
        .from("cart_items")
        .update({
          quantity: newQty,
          total_price: newQty * price,
          note,
        })
        .eq("id", existingItem.id)
        .select()
        .single();

      return { data, error };
    } else {
      // insert new cart item
      const { data, error } = await supabase
        .from("cart_items")
        .insert({
          user_id: user.id,
          menu_item_id: menuItemId,
          restaurant_id: restaurantId,
          quantity,
          price,
          total_price: totalPrice,
          note,
        })
        .select()
        .single();

      return { data, error };
    }
  }

  // Get Cart Items (with joins)
  async getCartItems(): Promise<{ data: CartItem[] | null; error: any }> {
    const { data: authData } = await supabase.auth.getUser();
    const user = authData?.user;
    if (!user) return { data: null, error: "Not logged in" };

    const { data, error } = await supabase
      .from("cart_items")
      .select(
        `
        *,
        menu_item:menu_items(*),
        restaurant:restaurants!cart_items_restaurant_id_fkey(id, restaurant_name, image_url)
      `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    return { data, error };
  }

  // Update item quantity
  async updateCartItem(cartItemId: string, quantity: number) {
    const { data: cartItem, error: fetchError } = await supabase
      .from("cart_items")
      .select("price")
      .eq("id", cartItemId)
      .single();

    if (fetchError) return { data: null, error: fetchError };

    const { data, error } = await supabase
      .from("cart_items")
      .update({
        quantity,
        total_price: cartItem.price * quantity,
      })
      .eq("id", cartItemId)
      .select()
      .single();

    return { data, error };
  }

  // Remove a single item
  async removeFromCart(cartItemId: string) {
    const { data, error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", cartItemId)
      .select();
    return { data, error };
  }

  // Clear entire cart
  async clearCart() {
    const { data: authData } = await supabase.auth.getUser();
    const user = authData?.user;
    if (!user) return { data: null, error: "Not logged in" };

    const { data, error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id)
      .select();

    return { data, error };
  }

  // Get total summary
  async getCartTotal() {
    const { data: authData } = await supabase.auth.getUser();
    const user = authData?.user;
    if (!user) return { data: null, error: "Not logged in" };

    const { data, error } = await supabase
      .from("cart_items")
      .select("total_price, quantity")
      .eq("user_id", user.id);

    if (error) return { data: null, error };

    const total = data.reduce((sum: number, item: any) => sum + Number(item.total_price), 0);
    const itemCount = data.reduce((sum: number, item: any) => sum + Number(item.quantity), 0);

    return { data: { total, itemCount }, error: null };
  }
}

export const cartService = new CartService();
