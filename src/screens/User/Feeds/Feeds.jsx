import React, { useState } from "react";
import { View, StyleSheet, FlatList, RefreshControl } from "react-native";
import { Appbar, useTheme, Snackbar } from "react-native-paper";
import FeedsCard from "./hooks/FeedsCard";
import useFeeds from "./hooks/useFeeds";

function Feeds({ navigation }) {
  const { colors } = useTheme();
  const { data: feeds, isRefetching, refetch } = useFeeds();


  return (
    <View style={styles.container}>
      <Appbar.Header style={{ elevation: 1 }}>
        <Appbar.Content title="Feeds" />
      </Appbar.Header>
      <FlatList
        data={feeds}
        renderItem={({ item }) => <FeedsCard feed={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />
        }
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: { marginTop: 10 },
});

export default Feeds;
