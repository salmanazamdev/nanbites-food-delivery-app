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
  category?: string; // Added category field from new schema
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
// Cart Service - SUPER SIMPLIFIED (Database Handles Everything)
// =======================
class CartService {
// Updated addToCart method for CartService
async addToCart(
  menuItemId: string,
  restaurantId: string,
  quantity: number = 1,
  note?: string
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { data: null, error: "NOT_LOGGED_IN" };

  // Get menu item details
  const { data: menuItem, error: menuError } = await supabase
    .from("menu_items")
    .select("price, restaurant_id")
    .eq("id", menuItemId)
    .single();

  if (menuError) return { data: null, error: menuError };

  const price = menuItem.price;
  const finalRestaurantId = restaurantId || menuItem.restaurant_id;

  // First, check if item already exists in cart
  const { data: existingItem, error: checkError } = await supabase
    .from("cart_items")
    .select("id, quantity, restaurant_id")
    .eq("user_id", user.id)
    .eq("menu_item_id", menuItemId)
    .single();

  // If item exists, update quantity
  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    const newTotalPrice = price * newQuantity;

    const { data, error } = await supabase
      .from("cart_items")
      .update({
        quantity: newQuantity,
        total_price: newTotalPrice,
        note: note || undefined, // Only update note if provided
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingItem.id)
      .select()
      .single();

    return { data, error };
  }

  // Check for different restaurant before attempting insert
  const { data: cartItems, error: cartCheckError } = await supabase
    .from("cart_items")
    .select("restaurant_id")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (cartItems && cartItems.restaurant_id !== finalRestaurantId) {
    return { data: null, error: "DIFFERENT_RESTAURANT" };
  }

  // Insert new item
  const totalPrice = price * quantity;

  const { data, error } = await supabase
    .from("cart_items")
    .insert({
      user_id: user.id,
      menu_item_id: menuItemId,
      restaurant_id: finalRestaurantId,
      quantity,
      price,
      total_price: totalPrice,
      note,
    })
    .select()
    .single();

  // Handle specific errors
  if (error) {
    if (error.message?.includes("Cart can only contain items from one restaurant")) {
      return { data: null, error: "DIFFERENT_RESTAURANT" };
    }
    if (error.code === "23505") {
      // This shouldn't happen now, but handle it just in case
      return { data: null, error: "DUPLICATE_ITEM" };
    }
  }

  return { data, error };
}

  // Get Cart Items (with joins)
  async getCartItems(): Promise<{ data: CartItem[] | null; error: any }> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { data: null, error: "Not logged in" };

    const { data, error } = await supabase
      .from("cart_items")
      .select(
        `
        *,
        menu_item:menu_items(*),
        restaurant:restaurants(id, restaurant_name, image_url)
      `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    return { data, error };
  }

  // Update item quantity (database will auto-calculate total_price)
  async updateCartItem(cartItemId: string, quantity: number) {
    return await supabase
      .from("cart_items")
      .update({ quantity }) // total_price will be auto-calculated by trigger
      .eq("id", cartItemId);
  }

  // Remove a single item
  async removeFromCart(cartItemId: string) {
    return await supabase.from("cart_items").delete().eq("id", cartItemId);
  }

  // Clear entire cart
  async clearCart() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { data: null, error: "NOT_LOGGED_IN" };

    return await supabase.from("cart_items").delete().eq("user_id", user.id);
  }

  // Get total summary
  async getCartTotal() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { data: null, error: "Not logged in" };

    const { data, error } = await supabase
      .from("cart_items")
      .select("total_price, quantity")
      .eq("user_id", user.id);

    if (error) return { data: null, error };

    const total = data.reduce((sum: number, item: any) => sum + item.total_price, 0);
    const itemCount = data.reduce((sum: number, item: any) => sum + item.quantity, 0);

    return { data: { total, itemCount }, error: null };
  }
}

export const cartService = new CartService();