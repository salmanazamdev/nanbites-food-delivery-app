import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useRoute, useNavigation } from "@react-navigation/native";
import Colors from "@/utils/constants/colors";
import { restaurantService, MenuItem } from "@/services/api/restaurantService";
import { cartService } from "@/services/api/restaurantService";

export default function MenuItemDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { itemId, restaurantId } = route.params;

  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadMenuItem();
  }, [itemId]);

  const loadMenuItem = async () => {
    try {
      const { data, error } = await restaurantService.getMenuItemById(itemId);
      if (error) throw error;
      setItem(data);
    } catch (err) {
      console.error("Error fetching menu item:", err);
      Alert.alert("Error", "Could not load menu item.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!item) return;

    setAdding(true);
    try {
      const res: any = await cartService.addToCart(
        item.id,
        restaurantId,
        quantity,
        note
      );

      // res has { data, error } shape or custom error
      const err = res?.error;

      if (err) {
        // Special handling for "different restaurant" error
        if (typeof err === "string" && err === "DIFFERENT_RESTAURANT") {
          // Ask user: clear cart and add this item?
          Alert.alert(
            "Different Restaurant",
            "Your cart contains items from another restaurant. Clear the cart and add this item?",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Clear & Add",
                style: "destructive",
                onPress: async () => {
                  // Clear cart then add again
                  const clearRes: any = await cartService.clearCart();
                  if (clearRes?.error) {
                    console.error("Clear cart error:", clearRes.error);
                    Alert.alert("Error", "Could not clear cart. Try again.");
                    setAdding(false);
                    return;
                  }

                  // Retry add
                  const retryRes: any = await cartService.addToCart(
                    item.id,
                    restaurantId,
                    quantity,
                    note
                  );
                  if (retryRes?.error) {
                    console.error("Retry add error:", retryRes.error);
                    Alert.alert("Error", "Could not add item after clearing cart.");
                  } else {
                    Alert.alert("Added to Cart", `${quantity}x ${item.name} added!`);
                  }
                },
              },
            ]
          );
          setAdding(false);
          return;
        }

        // General error fallback
        console.error("Add to cart error:", err);
        Alert.alert("Error", "Could not add item to cart. Please try again.");
        setAdding(false);
        return;
      }

      // Success
      Alert.alert("Added to Cart", `${quantity}x ${item.name} added!`);
    } catch (ex) {
      console.error("Unexpected error adding to cart:", ex);
      Alert.alert("Error", "Could not add item to cart. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  if (loading || !item) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading menu item...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Image + Back/Fav buttons */}
        <View style={styles.imageWrapper}>
          <Image source={{ uri: item.image_url }} style={styles.image} />
          <TouchableOpacity
            style={styles.topLeftIcon}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.topRightIcon}>
            <Icon name="heart-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View style={styles.infoSection}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.desc}>{item.description}</Text>
        </View>

        {/* Quantity */}
        <View style={styles.quantityRow}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={adding}
          >
            <Icon name="remove" size={20} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{quantity}</Text>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => setQuantity(quantity + 1)}
            disabled={adding}
          >
            <Icon name="add" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Note */}
        <TextInput
          style={styles.noteInput}
          placeholder="Note to Restaurant (optional)"
          placeholderTextColor={Colors.textSecondary}
          value={note}
          onChangeText={setNote}
          editable={!adding}
        />

        {/* Add to Cart */}
        <TouchableOpacity
          style={styles.addToCartBtn}
          onPress={handleAddToCart}
          disabled={adding}
        >
          <Text style={styles.addToCartText}>
            {adding ? "Adding..." : `Add to Cart • $${(item.price * quantity).toFixed(2)}`}
          </Text>
        </TouchableOpacity>

        {/* Go To Cart */}
        <TouchableOpacity
          style={styles.goToCartBtn}
          onPress={() => navigation.navigate("Cart" as never)}
        >
          <Text style={styles.goToCartText}>Go to Cart</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, color: Colors.secondary },

  imageWrapper: { position: "relative" },
  image: {
    width: "100%",
    height: 260,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  topLeftIcon: {
    position: "absolute",
    top: 20,
    left: 16,
    backgroundColor: "#0007",
    borderRadius: 20,
    padding: 6,
  },
  topRightIcon: {
    position: "absolute",
    top: 20,
    right: 16,
    backgroundColor: "#0007",
    borderRadius: 20,
    padding: 6,
  },
  infoSection: { padding: 18, paddingBottom: 0 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 6,
    color: Colors.text,
  },
  desc: { fontSize: 15, color: Colors.textSecondary, marginBottom: 20 },

  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  qtyBtn: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 10,
    padding: 8,
    marginHorizontal: 20,
  },
  qtyText: { fontSize: 18, fontWeight: "bold", color: Colors.text },

  noteInput: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 10,
    padding: 14,
    marginHorizontal: 18,
    marginBottom: 20,
    fontSize: 15,
    color: Colors.text,
  },

  addToCartBtn: {
    backgroundColor: Colors.accent,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginHorizontal: 18,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  addToCartText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },

  goToCartBtn: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 18,
    marginBottom: 24,
  },
  goToCartText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
});
