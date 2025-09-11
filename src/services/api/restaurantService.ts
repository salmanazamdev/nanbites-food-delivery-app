import { supabase } from '@/lib/supabase';

export interface Category {
  id: string;
  name: string;
  image_url?: string;
  icon_name?: string;
  is_active: boolean;
  sort_order: number;
}

export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  cover_image_url?: string;
  address: string;
  rating: number;
  total_reviews: number;
  delivery_fee: number;
  minimum_order: number;
  delivery_time: string;
  is_open: boolean;
  is_featured: boolean;
  categories?: Category[];
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  name: string;
  description?: string;
  image_url?: string;
  price: number;
  original_price?: number;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_spicy: boolean;
  is_popular: boolean;
  is_available: boolean;
}

class RestaurantService {
  // Get all categories
  async getCategories(): Promise<{ data: Category[] | null; error: any }> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    return { data, error };
  }

  // Get featured restaurants
  async getFeaturedRestaurants(): Promise<{ data: Restaurant[] | null; error: any }> {
    const { data, error } = await supabase
      .from('restaurants')
      .select(`
        *,
        categories:restaurant_categories(
          category:categories(*)
        )
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
        restaurant_categories!inner(category_id)
      `)
      .eq('restaurant_categories.category_id', categoryId)
      .eq('is_open', true)
      .order('rating', { ascending: false });

    return { data, error };
  }

  // Search restaurants
  async searchRestaurants(query: string): Promise<{ data: Restaurant[] | null; error: any }> {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
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
        categories:restaurant_categories(
          category:categories(*)
        )
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

  // Get nearby restaurants (you'll need to implement location logic)
  async getNearbyRestaurants(lat: number, lng: number, radius: number = 10): Promise<{ data: Restaurant[] | null; error: any }> {
    // For now, just return all restaurants
    // You can implement proper geolocation filtering later
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('is_open', true)
      .order('rating', { ascending: false })
      .limit(20);

    return { data, error };
  }
}

export const restaurantService = new RestaurantService();