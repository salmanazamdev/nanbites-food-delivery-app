import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Colors from "@/utils/constants/colors";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/context/AuthContext";
import { cartService, CartItem } from "@/services/api/restaurantService";

export default function CartScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await cartService.getCartItems();
      if (error) {
        Alert.alert("Error", "Failed to load cart items");
      } else {
        setItems(data || []);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    Alert.alert("Clear Cart", "Are you sure you want to remove all items?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes, Clear",
        style: "destructive",
        onPress: async () => {
          const { error } = await cartService.clearCart();
          if (error) {
            Alert.alert("Error", "Failed to clear cart");
          } else {
            setItems([]);
          }
        },
      },
    ]);
  };

  const removeItem = async (itemId: string) => {
    const { error } = await cartService.removeFromCart(itemId);
    if (error) {
      Alert.alert("Error", "Failed to remove item");
    } else {
      setItems((prev) => prev.filter((i) => i.id !== itemId));
    }
  };

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartbox}>
      <Image
        source={{ uri: item.menu_item?.image_url || item.restaurant?.image_url }}
        style={styles.image}
      />
      <View style={styles.card}>
        <View style={styles.titleRowInside}>
          <Text style={styles.title}>{item.menu_item?.name}</Text>
          <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.trashBtnSingle}>
            <Icon name="trash-outline" size={20} color="red" />
          </TouchableOpacity>
        </View>
        <Text style={styles.text}>Restaurant: {item.restaurant?.restaurant_name}</Text>
        <Text style={styles.text}>Quantity: {item.quantity}</Text>
        <Text style={styles.text}>Note: {item.note || "None"}</Text>
        <Text style={styles.text}>Total: ${item.total_price.toFixed(2)}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading your cart...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🔥 Header Row */}
      <View style={styles.titleRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Icon name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>

        <Text style={styles.heading}>Your Cart</Text>

        {items.length > 0 && (
          <TouchableOpacity onPress={clearCart} style={styles.clearBtn}>
            <Icon name="trash" size={22} color="white" />
          </TouchableOpacity>
        )}
      </View>

      {/* 🔥 Cart Items */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No items in cart.</Text>}
        contentContainerStyle={
          items.length === 0 && { flex: 1, justifyContent: "center", alignItems: "center" }
        }
      />

      {/* 🔥 Checkout Button */}
      {items.length > 0 && (
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => navigation.navigate("Checkout")}
        >
          <Text style={styles.checkoutText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: Colors.background },

  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, color: Colors.secondary },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 16,
    justifyContent: "space-between",
  },
  iconBtn: { padding: 4 },
  heading: { fontSize: 22, fontWeight: "bold", color: Colors.primary },
  clearBtn: {
    backgroundColor: Colors.primary,
    padding: 8,
    borderRadius: 8,
  },

  cartbox: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 10,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  image: { width: 80, height: 100, borderRadius: 8, marginRight: 14 },
  card: { flex: 1 },

  titleRowInside: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  title: { fontSize: 18, fontWeight: "bold", color: Colors.text },
  trashBtn: {
    backgroundColor: Colors.primary,
    padding: 6,
    borderRadius: 6,
  },
  trashBtnSingle: {
    padding: 4,
    borderRadius: 4,
  },
  text: { fontSize: 14, marginBottom: 2, color: Colors.textSecondary },

  checkoutBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 12,
    marginBottom: 4,
  },
  checkoutText: { color: "white", textAlign: "center", fontSize: 16, fontWeight: "bold" },
});
