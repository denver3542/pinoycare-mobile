import React, { useState } from "react";
import { View, StyleSheet, FlatList, RefreshControl, Text } from "react-native";
import { Modal, useTheme, Button } from "react-native-paper";
import FeedsCard from "../../components/FeedsCard";
import { useNavigation } from "@react-navigation/native";
import useFeeds from "../../hooks/useFeeds";

function GuestFeeds() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { data: feeds, isRefetching, refetch } = useFeeds();
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    refetch()
      .then(() => { })
      .catch(() => { })
      .finally(() => {
        setRefreshing(false);
      });
  };

  const handleSignIn = () => {
    setShowSignInModal(false);
    navigation.navigate("Login");
  };


  const onClose = () => {
    setShowSignInModal(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={feeds}
        renderItem={({ item }) => (
          <FeedsCard feed={item} setShowSignInModal={setShowSignInModal} />
        )}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
      />
      <Modal
        visible={showSignInModal}
        onDismiss={onClose}
        contentContainerStyle={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <Text style={{ fontSize: 18, marginBottom: 20 }}>
            Please sign in to react a post.
          </Text>
          <Button onPress={handleSignIn} mode="contained" style={{ color: "white", marginBottom: 10 }}>
            Sign In
          </Button>
          <Button onPress={onClose}>Cancel</Button>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8
  },
  title: {
    color: "#0A3480",
    fontWeight: "bold",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0A3480",
    alignSelf: "center",
  },
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
});

export default GuestFeeds;
