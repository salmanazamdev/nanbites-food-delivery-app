import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Colors from "@/utils/constants/colors";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/context/AuthContext";
import { cartService, CartItem } from "@/services/api/restaurantService";

const deliveryFee = 5;

export default function CheckoutScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCartItems = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data, error } = await cartService.getCartItems();
      if (error) {
        Alert.alert("Error", "Failed to load cart items");
        setCartItems([]);
        setSubtotal(0);
        return;
      }
      const items = data || [];
      setCartItems(items);

      const total = items.reduce((sum, item) => sum + item.total_price, 0);
      setSubtotal(total);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCartItems([]);
      setSubtotal(0);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    const { error } = await cartService.removeFromCart(itemId);
    if (error) {
      Alert.alert("Error", "Failed to remove item");
    } else {
      setCartItems((prev) => prev.filter((i) => i.id !== itemId));
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleProceedToPayment = () => {
    if (!cartItems.length) {
      Alert.alert("Cart Empty", "Please add items before proceeding.");
      return;
    }
    // 🔥 Later: integrate order + payment flow
    navigation.navigate("Orders");
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Your cart is empty.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
        </View>

        {/* Delivery Address */}
        <Text style={styles.sectionTitle}>Deliver to</Text>
        <TouchableOpacity
          style={styles.boxRow}
          onPress={() => Alert.alert("Address", "Address selection coming soon")}
        >
          <Text style={styles.addressLabel}>Select your delivery address</Text>
          <Text style={styles.changeText}>Change</Text>
        </TouchableOpacity>

        {/* Order Summary */}
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.box}>
          {cartItems.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              {item.menu_item?.image_url && (
                <Image
                  source={{ uri: item.menu_item.image_url }}
                  style={styles.itemImage}
                />
              )}
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.menu_item?.name}</Text>
                <Text style={styles.itemDetail}>
                  Quantity: {item.quantity}
                </Text>
                <Text style={styles.itemPrice}>
                  ${item.total_price.toFixed(2)}
                </Text>
              </View>
              <TouchableOpacity onPress={() => removeItem(item.id)}>
                <Text style={styles.remove}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Payment Method */}
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <TouchableOpacity
          style={styles.boxRow}
          onPress={() =>
            Alert.alert("Payment Method", "Payment selection coming soon")
          }
        >
          <Text style={styles.addressLabel}>Select Payment Method</Text>
          <Text style={styles.changeText}>Change</Text>
        </TouchableOpacity>

        {/* Discounts */}
        <Text style={styles.sectionTitle}>Get Discounts</Text>
        <TouchableOpacity
          style={styles.boxRow}
          onPress={() =>
            Alert.alert("Discounts", "Discounts feature coming soon")
          }
        >
          <Text style={styles.addressLabel}>Apply a discount code</Text>
          <Text style={styles.changeText}>Apply</Text>
        </TouchableOpacity>

        {/* Totals */}
        <View style={styles.box}>
          <View style={styles.totalRow}>
            <Text>Subtotal</Text>
            <Text>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>Delivery Fee</Text>
            <Text>${deliveryFee.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={{ fontWeight: "bold" }}>Total</Text>
            <Text style={{ fontWeight: "bold" }}>
              ${(subtotal + deliveryFee).toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.placeOrderButton}
          onPress={handleProceedToPayment}
        >
          <Text style={styles.placeOrderText}>Proceed to Payment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 40,
    paddingHorizontal: 20,
  },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: Colors.text },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 20,
    paddingHorizontal: 20,
    color: Colors.text,
  },
  box: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  boxRow: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addressLabel: { fontSize: 16, fontWeight: "500", color: Colors.text },
  changeText: { color: Colors.primary, fontWeight: "bold" },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  itemImage: { width: 60, height: 60, borderRadius: 8, marginRight: 15 },
  itemInfo: { flex: 1, justifyContent: "center" },
  itemName: { fontWeight: "bold", color: Colors.text },
  itemDetail: { fontSize: 12, color: Colors.textSecondary },
  itemPrice: { fontWeight: "500", marginTop: 4, color: Colors.text },
  remove: { color: "red", fontWeight: "bold", fontSize: 12 },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  placeOrderButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 35,
    marginTop: 3,
  },
  placeOrderText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
