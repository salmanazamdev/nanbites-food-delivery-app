import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { orderService, Order } from "@/services/api/orderService";
import { useAuth } from "@/context/AuthContext";
import Colors from "@/utils/constants/colors";

const OrdersScreen = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      setLoading(true);
      const { data, error } = await orderService.getOrdersByUser(user.id);
      if (!error && data) setOrders(data);
      setLoading(false);
    };

    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-500">No orders yet</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={{
            backgroundColor: "white",
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }}
        >
          <Text style={{ fontWeight: "600", fontSize: 16 }}>
            Order #{item.order_number}
          </Text>
          <Text>Status: {item.status}</Text>
          <Text>Total: Rs {item.total_amount}</Text>
          <Text>Date: {new Date(item.created_at).toLocaleDateString()}</Text>
        </TouchableOpacity>
      )}
    />
  );
};

export default OrdersScreen;
