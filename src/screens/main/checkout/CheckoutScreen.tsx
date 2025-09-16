import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Colors from "@/utils/constants/colors";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/context/AuthContext";
import { cartService } from "@/services/api/restaurantService";
import { supabase } from "@/lib/supabase";

export default function CheckoutScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  useEffect(() => {
    loadCart();
    loadDefaultAddress();
  }, []);

  const loadCart = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await cartService.getCartItems();
      if (error) throw error;
      setCartItems(data || []);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const loadDefaultAddress = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("user_addresses")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_default", true)
      .single();

    if (!error && data) setSelectedAddress(data);
  };

  const getCartTotal = () =>
    cartItems.reduce((sum, item) => sum + (item.total_price || 0), 0);

  const placeOrder = async () => {
    if (!user) return Alert.alert("Error", "You must be logged in");
    if (!selectedAddress) return Alert.alert("Error", "Please select an address");

    try {
      setLoading(true);

      // create order row
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            user_id: user.id,
            restaurant_id: cartItems[0]?.restaurant_id, // assumes cart only from one restaurant
            address_id: selectedAddress.id,
            total_amount: getCartTotal(),
            payment_method: paymentMethod,
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // create order_items rows
      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        price: item.price,
        total_price: item.total_price,
      }));

      const { error: orderItemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (orderItemsError) throw orderItemsError;

      // clear cart
      await cartService.clearCart();

      Alert.alert("Success", "Your order has been placed!");
      navigation.navigate("Orders"); // go to orders tab
    } catch (err: any) {
      console.error("Order error:", err.message);
      Alert.alert("Error", "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text>Processing...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.titleRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.heading}>Checkout</Text>
        <View style={{ width: 24 }} /> {/* spacer */}
      </View>

      {/* Address */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        {selectedAddress ? (
          <Text style={styles.text}>{selectedAddress.address}</Text>
        ) : (
          <Text style={styles.text}>No default address set</Text>
        )}
        <TouchableOpacity
          style={styles.changeBtn}
          onPress={() => Alert.alert("Address Change", "Address picker to be added")}
        >
          <Text style={styles.changeText}>Change</Text>
        </TouchableOpacity>
      </View>

      {/* Payment */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <Text style={styles.text}>{paymentMethod}</Text>
      </View>

      {/* Order Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <Text style={styles.text}>Items: {cartItems.length}</Text>
        <Text style={styles.text}>Total: ${getCartTotal().toFixed(2)}</Text>
      </View>

      {/* Confirm */}
      <TouchableOpacity style={styles.confirmBtn} onPress={placeOrder}>
        <Text style={styles.confirmText}>Place Order</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  heading: { fontSize: 22, fontWeight: "bold", color: Colors.primary },
  section: {
    backgroundColor: Colors.backgroundLight,
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 6 },
  text: { fontSize: 14, color: Colors.textSecondary },
  changeBtn: { marginTop: 6 },
  changeText: { fontSize: 14, color: Colors.primary },
  confirmBtn: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmText: { color: "white", fontSize: 16, fontWeight: "bold" },
});
