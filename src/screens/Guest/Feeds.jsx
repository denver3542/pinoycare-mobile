import React from "react";
import { View, StyleSheet, FlatList, RefreshControl } from "react-native";
import { Appbar, useTheme } from "react-native-paper";
import FeedsCard from "../../components/FeedsCard";
import { useNavigation } from "@react-navigation/native";
import useFeeds from "../../hooks/useFeeds";

function GuestFeeds() {
  const { colors } = useTheme();
  const { data: feeds, isRefetching, refetch } = useFeeds();
  // console.log(feeds);

  return (
    <View style={styles.container}>
      <FlatList
        data={feeds}
        renderItem={({ item }) => <FeedsCard feed={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.primary}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    color: "#0A3480",
    fontWeight: "bold",
  },
  listContainer: { marginTop: 10 },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0A3480",
    alignSelf: "center",
  },
});

export default GuestFeeds;
