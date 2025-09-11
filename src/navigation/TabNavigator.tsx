// src/navigation/TabNavigator.tsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/Ionicons";
import Colors from "@/utils/constants/colors";

// Import your screens (we'll create these next)
// import HomeScreen from "../screens/main/home/HomeScreen";
// import SearchScreen from "../screens/main/search/SearchScreen";
// import CartScreen from "../screens/main/cart/CartScreen";
// import OrdersScreen from "../screens/main/orders/OrdersScreen";
// import ProfileScreen from "../screens/main/profile/ProfileScreen";
// import RestaurantDetailScreen from "../screens/main/restaurant/RestaurantDetailScreen";
// import CategoryRestaurantsScreen from "../screens/main/restaurant/CategoryRestaurantsScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// // Home Stack Navigator
// const HomeStackNavigator = () => (
//   <Stack.Navigator screenOptions={{ headerShown: false }}>
//     <Stack.Screen name="HomeScreen" component={HomeScreen} />
//     <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
//     <Stack.Screen name="CategoryRestaurants" component={CategoryRestaurantsScreen} />
//   </Stack.Navigator>
// );

// // Search Stack Navigator
// const SearchStackNavigator = () => (
//   <Stack.Navigator screenOptions={{ headerShown: false }}>
//     <Stack.Screen name="SearchScreen" component={SearchScreen} />
//     <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
//   </Stack.Navigator>
// );

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: string;

        switch (route.name) {
          case 'Home':
            iconName = focused ? 'home' : 'home-outline';
            break;
          case 'Search':
            iconName = focused ? 'search' : 'search-outline';
            break;
          case 'Cart':
            iconName = focused ? 'bag' : 'bag-outline';
            break;
          case 'Orders':
            iconName = focused ? 'receipt' : 'receipt-outline';
            break;
          case 'Profile':
            iconName = focused ? 'person' : 'person-outline';
            break;
          default:
            iconName = 'home-outline';
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: Colors.secondary,
      tabBarStyle: {
        backgroundColor: Colors.background,
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
        paddingBottom: 8,
        paddingTop: 8,
        height: 60,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '500',
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeStackNavigator} />
    <Tab.Screen name="Search" component={SearchStackNavigator} />
    <Tab.Screen name="Cart" component={CartScreen} />
    <Tab.Screen name="Orders" component={OrdersScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export default TabNavigator;