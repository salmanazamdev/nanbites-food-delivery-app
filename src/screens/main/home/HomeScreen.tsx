// src/screens/main/home/HomeScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '@/utils/constants/colors';
import { useAuth } from '@/context/AuthContext';
import { restaurantService, Category, Restaurant } from '@/services/api/restaurantService';

const { width } = Dimensions.get('window');

type HomeScreenNavigationProp = NativeStackNavigationProp<any>;

interface CategoryItemProps {
  category: Category;
  onPress: () => void;
}

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress: () => void;
}

interface SpecialOfferProps {
  title: string;
  subtitle: string;
  discount: string;
  image: string;
  onPress: () => void;
}

const SpecialOfferCard: React.FC<SpecialOfferProps> = ({ title, subtitle, discount, image, onPress }) => (
  <TouchableOpacity style={styles.offerCard} onPress={onPress}>
    <View style={styles.offerContent}>
      <Text style={styles.offerDiscount}>{discount}</Text>
      <Text style={styles.offerTitle}>{title}</Text>
      <Text style={styles.offerSubtitle}>{subtitle}</Text>
    </View>
    <Image source={{ uri: image }} style={styles.offerImage} />
  </TouchableOpacity>
);

const CategoryItem: React.FC<CategoryItemProps> = ({ category, onPress }) => (
  <TouchableOpacity style={styles.categoryItem} onPress={onPress}>
    <View style={styles.categoryImageContainer}>
      {category.image_url ? (
        <Image source={{ uri: category.image_url }} style={styles.categoryImage} />
      ) : (
        <View style={styles.categoryPlaceholder}>
          <Icon 
            name={getCategoryIcon(category.category_name)} 
            size={24} 
            color={Colors.primary} 
          />
        </View>
      )}
    </View>
    <Text style={styles.categoryName}>{category.category_name}</Text>
  </TouchableOpacity>
);

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onPress }) => (
  <TouchableOpacity style={styles.restaurantCard} onPress={onPress}>
    <Image 
      source={{ uri: restaurant.image_url || 'https://via.placeholder.com/300x200' }} 
      style={styles.restaurantImage}
      defaultSource={{ uri: 'https://via.placeholder.com/300x200' }}
    />
    <TouchableOpacity style={styles.favoriteButton}>
      <Icon name="heart-outline" size={20} color="#fff" />
    </TouchableOpacity>
    <View style={styles.restaurantInfo}>
      <Text style={styles.restaurantName} numberOfLines={1}>
        {restaurant.restaurant_name}
      </Text>
      <View style={styles.restaurantMeta}>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={14} color="#FFD700" />
          <Text style={styles.rating}>{restaurant.rating || '4.5'}</Text>
          <Text style={styles.reviewCount}>({restaurant.total_reviews || '100'}+)</Text>
        </View>
        <Text style={styles.deliveryTime}>{restaurant.delivery_time}</Text>
      </View>
      <View style={styles.deliveryInfo}>
        <Text style={styles.deliveryFee}>
          {restaurant.delivery_fee === 0 ? 'Free delivery' : `$${restaurant.delivery_fee} delivery`}
        </Text>
      </View>
    </View>
    
  </TouchableOpacity>
);

// Helper function to get category icons
const getCategoryIcon = (categoryName: string): string => {
  const iconMap: { [key: string]: string } = {
    'Hamburger': 'fast-food-outline',
    'Pizza': 'pizza-outline',
    'Noodles': 'restaurant-outline',
    'Meat': 'restaurant-outline',
    'Vegetable': 'leaf-outline',
    'Dessert': 'ice-cream-outline',
    'Drink': 'wine-outline',
    'More': 'grid-outline',
  };
  return iconMap[categoryName] || 'restaurant-outline';
};

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useAuth();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredRestaurants, setFeaturedRestaurants] = useState<Restaurant[]>([]);
  const [discountRestaurants, setDiscountRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock special offers data
  const specialOffers = [
    {
      title: "DISCOUNT ONLY",
      subtitle: "VALID FOR TODAY!",
      discount: "30%",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=250&fit=crop"
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [categoriesResult, restaurantsResult] = await Promise.all([
        restaurantService.getCategories(),
        restaurantService.getFeaturedRestaurants()
      ]);

      if (categoriesResult.error) {
        console.error('Categories error:', categoriesResult.error);
        Alert.alert('Error', 'Failed to load categories');
      } else {
        setCategories(categoriesResult.data || []);
      }

      if (restaurantsResult.error) {
        console.error('Restaurants error:', restaurantsResult.error);
        Alert.alert('Error', 'Failed to load restaurants');
      } else {
        const restaurants = restaurantsResult.data || [];
        setFeaturedRestaurants(restaurants);
        // Mock discount restaurants (you can filter based on actual discount logic)
        setDiscountRestaurants(restaurants.slice(0, 4));
      }
    } catch (error) {
      console.error('Load data error:', error);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleCategoryPress = (category: Category) => {
    navigation.navigate('CategoryRestaurants', {
      categoryId: category.id,
      categoryName: category.category_name,
    });
  };

  const handleRestaurantPress = (restaurant: Restaurant) => {
    navigation.navigate('RestaurantDetail', {
      restaurantId: restaurant.id,
    });
  };

  const handleSearchPress = () => {
    navigation.navigate('Search');
  };

  const handleSeeAllOffers = () => {
    navigation.navigate('Offers');
  };

  const handleSeeAllDiscount = () => {
    navigation.navigate('DiscountRestaurants');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading delicious food...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image 
            source={{ uri: user?.user_metadata?.avatar_url || 'https://via.placeholder.com/40' }} 
            style={styles.userAvatar}
          />
          <View style={styles.locationContainer}>
            <Text style={styles.locationLabel}>Deliver to</Text>
            <View style={styles.locationRow}>
              <Text style={styles.locationText}>Times Square</Text>
              <Icon name="chevron-down" size={16} color={Colors.primary} />
            </View>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="scan-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="notifications-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <TouchableOpacity style={styles.searchBar} onPress={handleSearchPress}>
        <Icon name="search-outline" size={20} color={Colors.secondary} />
        <Text style={styles.searchPlaceholder}>What are you craving?</Text>
      </TouchableOpacity>

      {/* Special Offers */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Special Offers</Text>
          <TouchableOpacity onPress={handleSeeAllOffers}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={specialOffers}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <SpecialOfferCard 
              title={item.title}
              subtitle={item.subtitle}
              discount={item.discount}
              image={item.image}
              onPress={() => {}}
            />
          )}
          contentContainerStyle={styles.offersList}
        />
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CategoryItem 
              category={item} 
              onPress={() => handleCategoryPress(item)} 
            />
          )}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Discount Guaranteed */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.discountHeader}>
            <Text style={styles.sectionTitle}>Discount Guaranteed</Text>
            <Text style={styles.discountEmoji}>💰</Text>
          </View>
          <TouchableOpacity onPress={handleSeeAllDiscount}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={discountRestaurants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RestaurantCard 
              restaurant={item} 
              onPress={() => handleRestaurantPress(item)} 
            />
          )}
          contentContainerStyle={styles.discountList}
        />
      </View>

      {/* Featured Restaurants */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Near You</Text>
        {featuredRestaurants.slice(0, 6).map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            onPress={() => handleRestaurantPress(restaurant)}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    color: Colors.secondary,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  locationContainer: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: Colors.secondary,
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginRight: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 24,
  },
  searchPlaceholder: {
    marginLeft: 12,
    color: Colors.secondary,
    fontSize: 16,
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  discountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  discountEmoji: {
    marginLeft: 8,
    fontSize: 18,
  },
  seeAllText: {
    fontSize: 14,
    color: '#00B14F',
    fontWeight: '600',
  },
  offersList: {
    paddingHorizontal: 20,
  },
  offerCard: {
    backgroundColor: '#00B14F',
    borderRadius: 16,
    padding: 20,
    marginRight: 16,
    width: width * 0.8,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  offerContent: {
    flex: 1,
  },
  offerDiscount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  offerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  offerImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginLeft: 16,
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
    width: 70,
  },
  categoryImageContainer: {
    width: 56,
    height: 56,
    marginBottom: 8,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
  },
  categoryPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    backgroundColor: '#F0F4F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary,
    textAlign: 'center',
  },
  discountList: {
    paddingHorizontal: 20,
  },
  restaurantCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    marginRight: 16,
    width: width * 0.7,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
  },
  restaurantImage: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popularBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#00B14F',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  restaurantInfo: {
    padding: 12,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 6,
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: Colors.secondary,
    marginLeft: 4,
  },
  deliveryTime: {
    fontSize: 14,
    color: Colors.secondary,
  },
  deliveryInfo: {
    marginTop: 4,
  },
  deliveryFee: {
    fontSize: 14,
    color: '#00B14F',
    fontWeight: '500',
  },
});

export default HomeScreen;