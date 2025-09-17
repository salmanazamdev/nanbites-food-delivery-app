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

    try {
      const { error } = await cartService.addToCart(
        item.id,
        restaurantId,
        quantity,
        note
      );
      if (error) throw error;

      Alert.alert("Added to Cart", `${quantity}x ${item.name} added!`);
    } catch (err) {
      console.error("Error adding to cart:", err);
      Alert.alert("Error", "Could not add item to cart. Please try again.");
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
          >
            <Icon name="remove" size={20} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{quantity}</Text>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => setQuantity(quantity + 1)}
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
        />

          {/* Add to Cart */}
          <TouchableOpacity style={styles.addToCartBtn} onPress={handleAddToCart}>
            <Text style={styles.addToCartText}>
              Add to Cart • ${(item.price * quantity).toFixed(2)}
            </Text>
          </TouchableOpacity>

          {/* Checkout */}
          <TouchableOpacity
            style={styles.goToCartBtn}
            onPress={() => navigation.navigate("Cart" as never)} // Type-safe navigate
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
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 6, color: Colors.text },
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