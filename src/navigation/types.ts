export type RootStackParamList = {
  Home: undefined; // no params expected
  Cart: { userId: string }; // Cart screen expects userId
  CategoryRestaurants: { categoryId: string };
  RestaurantDetail: { restaurantId: string };
};
