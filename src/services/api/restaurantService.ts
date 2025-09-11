import { supabase } from '@/lib/supabase';

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

class RestaurantService {
  // Get all categories
  async getCategories(): Promise<{ data: Category[] | null; error: any }> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('category_name', { ascending: true });

    return { data, error };
  }

  // Get featured restaurants
  async getFeaturedRestaurants(): Promise<{ data: Restaurant[] | null; error: any }> {
    const { data, error } = await supabase
      .from('restaurants')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('is_featured', true)
      .eq('is_open', true)
      .order('rating', { ascending: false })
      .limit(10);

    return { data, error };
  }

  // Get restaurants by category
  async getRestaurantsByCategory(categoryId: string): Promise<{ data: Restaurant[] | null; error: any }> {
    const { data, error } = await supabase
      .from('restaurants')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('category_id', categoryId)
      .eq('is_open', true)
      .order('rating', { ascending: false });

    return { data, error };
  }

  // Search restaurants
  async searchRestaurants(query: string): Promise<{ data: Restaurant[] | null; error: any }> {
    const { data, error } = await supabase
      .from('restaurants')
      .select(`
        *,
        category:categories(*)
      `)
      .or(`restaurant_name.ilike.%${query}%,address.ilike.%${query}%`)
      .eq('is_open', true)
      .order('rating', { ascending: false });

    return { data, error };
  }

  // Get restaurant details
  async getRestaurantById(id: string): Promise<{ data: Restaurant | null; error: any }> {
    const { data, error } = await supabase
      .from('restaurants')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('id', id)
      .single();

    return { data, error };
  }

  // Get menu items for restaurant
  async getMenuItems(restaurantId: string): Promise<{ data: MenuItem[] | null; error: any }> {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('is_available', true)
      .order('is_popular', { ascending: false })
      .order('name', { ascending: true });

    return { data, error };
  }

  // Get all restaurants
  async getAllRestaurants(): Promise<{ data: Restaurant[] | null; error: any }> {
    const { data, error } = await supabase
      .from('restaurants')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('is_open', true)
      .order('rating', { ascending: false })
      .limit(20);

    return { data, error };
  }

  // Add to favorites
  async addToFavorites(restaurantId: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('user_favorites')
      .insert({
        restaurant_id: restaurantId
      });

    return { error };
  }

  // Remove from favorites
  async removeFromFavorites(restaurantId: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('restaurant_id', restaurantId);

    return { error };
  }

  // Check if restaurant is in favorites
  async isFavorite(restaurantId: string): Promise<{ data: boolean; error: any }> {
    const { data, error } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('restaurant_id', restaurantId)
      .single();

    return { data: !!data, error: error?.code === 'PGRST116' ? null : error };
  }

  // Get user's favorite restaurants
  async getUserFavorites(): Promise<{ data: Restaurant[] | null; error: any }> {
    const { data, error } = await supabase
      .from('user_favorites')
      .select(`
        restaurant:restaurants(
          *,
          category:categories(*)
        )
      `);

    if (error) return { data: null, error };

    const restaurants = data?.map(item => item.restaurant).filter(Boolean) || [];
    return { data: restaurants as Restaurant[], error: null };
  }
}

export const restaurantService = new RestaurantService();

// Cart Service
class CartService {
  // Add item to cart
  async addToCart(menuItemId: string, restaurantId: string, quantity: number = 1, note?: string): Promise<{ error: any }> {
    // First get the menu item details to get the price
    const { data: menuItem, error: menuError } = await supabase
      .from('menu_items')
      .select('price')
      .eq('id', menuItemId)
      .single();

    if (menuError) return { error: menuError };

    const price = menuItem.price;
    const totalPrice = price * quantity;

    // Check if item already exists in cart
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('menu_item_id', menuItemId)
      .single();

    if (existingItem) {
      // Update existing item
      const { error } = await supabase
        .from('cart_items')
        .update({
          quantity: existingItem.quantity + quantity,
          total_price: (existingItem.quantity + quantity) * price,
          note
        })
        .eq('id', existingItem.id);

      return { error };
    } else {
      // Insert new item
      const { error } = await supabase
        .from('cart_items')
        .insert({
          menu_item_id: menuItemId,
          restaurant_id: restaurantId,
          quantity,
          price,
          total_price: totalPrice,
          note
        });

      return { error };
    }
  }

  // Get cart items
  async getCartItems(): Promise<{ data: CartItem[] | null; error: any }> {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        menu_item:menu_items(*),
        restaurant:restaurants(restaurant_name, image_url)
      `)
      .order('created_at', { ascending: true });

    return { data, error };
  }

  // Update cart item quantity
  async updateCartItem(cartItemId: string, quantity: number): Promise<{ error: any }> {
    const { data: cartItem, error: fetchError } = await supabase
      .from('cart_items')
      .select('price')
      .eq('id', cartItemId)
      .single();

    if (fetchError) return { error: fetchError };

    const { error } = await supabase
      .from('cart_items')
      .update({
        quantity,
        total_price: cartItem.price * quantity
      })
      .eq('id', cartItemId);

    return { error };
  }

  // Remove item from cart
  async removeFromCart(cartItemId: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId);

    return { error };
  }

  // Clear cart
  async clearCart(): Promise<{ error: any }> {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all items

    return { error };
  }

  // Get cart total
  async getCartTotal(): Promise<{ data: { total: number; itemCount: number } | null; error: any }> {
    const { data, error } = await supabase
      .from('cart_items')
      .select('total_price, quantity');

    if (error) return { data: null, error };

    const total = data.reduce((sum, item) => sum + item.total_price, 0);
    const itemCount = data.reduce((sum, item) => sum + item.quantity, 0);

    return { data: { total, itemCount }, error: null };
  }
}

export const cartService = new CartService();