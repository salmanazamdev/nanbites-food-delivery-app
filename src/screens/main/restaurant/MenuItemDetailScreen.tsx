import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useRoute, useNavigation } from "@react-navigation/native";
import Colors from "@/utils/constants/colors";
import { restaurantService, MenuItem } from "@/services/api/restaurantService";
import { cartService } from "@/services/api/restaurantService";

export default function MenuItemDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { itemId, restaurantId } = route.params; // passed from RestaurantDetail

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
      Alert.alert("Error", "Could not add item to cart.");
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 🖼 Image + Back/Fav buttons */}
      <View style={styles.imageWrapper}>
        <Image source={{ uri: item.image_url }} style={styles.image} />
        <TouchableOpacity
          style={styles.topLeftIcon}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.topRightIcon}>
          <Icon name="heart-outline" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* ℹ️ Info */}
      <View style={styles.infoSection}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.desc}>{item.description}</Text>
      </View>

      {/* 🔢 Quantity */}
      <View style={styles.quantityRow}>
        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() => setQuantity(Math.max(1, quantity - 1))}
        >
          <Icon name="remove" size={22} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.qtyText}>{quantity}</Text>
        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() => setQuantity(quantity + 1)}
        >
          <Icon name="add" size={22} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* 📝 Note */}
      <TextInput
        style={styles.noteInput}
        placeholder="Note to Restaurant (optional)"
        value={note}
        onChangeText={setNote}
      />

      {/* 🛒 Add to Cart */}
      <TouchableOpacity style={styles.greenBtn} onPress={handleAddToCart}>
        <Text style={styles.greenBtnText}>
          Add to Cart - ${(item.price * quantity).toFixed(2)}
        </Text>
      </TouchableOpacity>

      {/* ✅ Checkout */}
      <TouchableOpacity
        style={styles.checkBtn}
        onPress={() => navigation.navigate("CartScreen")}
      >
        <Text style={styles.checkBtnText}>Checkout your cart</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, marginTop: 25 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, color: Colors.secondary },

  imageWrapper: { position: "relative" },
  image: {
    width: "100%",
    height: 280,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginTop: 9,
  },
  topLeftIcon: {
    position: "absolute",
    top: 30,
    left: 18,
    backgroundColor: "#0007",
    borderRadius: 20,
    padding: 4,
  },
  topRightIcon: {
    position: "absolute",
    top: 30,
    right: 18,
    backgroundColor: "#0007",
    borderRadius: 20,
    padding: 4,
  },
  infoSection: { padding: 18, paddingBottom: 0 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 10, color: Colors.text },
  desc: { fontSize: 15, color: Colors.textSecondary, marginBottom: 18 },

  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 18,
  },
  qtyBtn: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 8,
    padding: 8,
    marginHorizontal: 28,
  },
  qtyText: { fontSize: 20, fontWeight: "bold", color: Colors.text },

  noteInput: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 18,
    marginBottom: 24,
    fontSize: 15,
    color: Colors.text,
  },

  greenBtn: {
    backgroundColor: Colors.accent,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 18,
    marginBottom: 30,
  },
  greenBtnText: { color: "#fff", fontWeight: "bold", fontSize: 18 },

  checkBtn: {
    backgroundColor: "#e1f1e9cc",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    marginHorizontal: 90,
    marginBottom: 30,
  },
  checkBtnText: { color: Colors.text, fontSize: 15 },
});
