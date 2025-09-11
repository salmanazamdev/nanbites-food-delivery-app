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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '@/utils/constants/colors';
import { useAuth } from '@/context/AuthContext';
import { restaurantService, Category, Restaurant } from '@/services/api/restaurantService';

type HomeScreenNavigationProp = NativeStackNavigationProp<any>;

interface CategoryItemProps {
  category: Category;
  onPress: () => void;
}

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress: () => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category, onPress }) => (
  <TouchableOpacity style={styles.categoryItem} onPress={onPress}>
    <View style={styles.categoryImageContainer}>
      {category.image_url ? (
        <Image source={{ uri: category.image_url }} style={styles.categoryImage} />
      ) : (
        <View style={styles.categoryPlaceholder}>
          <Icon 
            name={category.icon_name || 'restaurant'} 
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
    <View style={styles.restaurantInfo}>
      <Text style={styles.restaurantName} numberOfLines={1}>
        {restaurant.name}
      </Text>
      <Text style={styles.restaurantDescription} numberOfLines={2}>
        {restaurant.description}
      </Text>
      <View style={styles.restaurantMeta}>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={14} color="#FFD700" />
          <Text style={styles.rating}>{restaurant.rating}</Text>
          <Text style={styles.reviewCount}>({restaurant.total_reviews})</Text>
        </View>
        <Text style={styles.deliveryTime}>{restaurant.delivery_time}</Text>
      </View>
      <View style={styles.deliveryInfo}>
        <Text style={styles.deliveryFee}>
          Delivery: ${restaurant.delivery_fee === 0 ? 'Free' : restaurant.delivery_fee}
        </Text>
        <Text style={styles.minimumOrder}>
          Min: ${restaurant.minimum_order}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useAuth();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredRestaurants, setFeaturedRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
        setFeaturedRestaurants(restaurantsResult.data || []);
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
      categoryName: category.name,
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
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <Icon name="location-outline" size={20} color={Colors.primary} />
          <Text style={styles.locationText}>Current Location</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Icon name="notifications-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Welcome Message */}
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>
          Hello {user?.user_metadata?.full_name || 'Foodie'}! 👋
        </Text>
        <Text style={styles.subtitleText}>What would you like to eat today?</Text>
      </View>

      {/* Search Bar */}
      <TouchableOpacity style={styles.searchBar} onPress={handleSearchPress}>
        <Icon name="search-outline" size={20} color={Colors.secondary} />
        <Text style={styles.searchPlaceholder}>Search for restaurants, food...</Text>
      </TouchableOpacity>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
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

      {/* Featured Restaurants */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Restaurants</Text>
        <FlatList
          data={featuredRestaurants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RestaurantCard 
              restaurant={item} 
              onPress={() => handleRestaurantPress(item)} 
            />
          )}
          scrollEnabled={false}
          contentContainerStyle={styles.restaurantsList}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
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
    paddingTop: 50,
    paddingBottom: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary,
  },
  notificationButton: {
    padding: 8,
  },
  welcomeContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 16,
    color: Colors.secondary,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 24,
  },
  searchPlaceholder: {
    marginLeft: 12,
    color: Colors.secondary,
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  categoryImageContainer: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  categoryPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 12,
    color: Colors.primary,
    textAlign: 'center',
    maxWidth: 70,
  },
  restaurantsList: {
    paddingHorizontal: 20,
  },
  restaurantCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  restaurantImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  restaurantInfo: {
    padding: 12,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  restaurantDescription: {
    fontSize: 14,
    color: Colors.secondary,
    marginBottom: 8,}
  });