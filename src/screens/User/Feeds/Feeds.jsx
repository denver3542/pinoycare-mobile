import React, { useState, useEffect } from "react";
import { View, StyleSheet, RefreshControl, Image, ActivityIndicator } from "react-native";
import { Appbar, useTheme } from "react-native-paper";
import FeedsCard from "./hooks/FeedsCard";
import HeaderMessageNotification from "../../../components/HeaderMessageNotification";
import HeaderNotification from "../../../components/HeaderNotification";
import useFeeds from "./hooks/useFeeds";
import { FlashList } from "@shopify/flash-list";

const Feeds = ({ navigation }) => {
  const { colors } = useTheme();
  const { data: initialFeeds = [], refetch } = useFeeds();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    const newFeeds = await refetch();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: '#0A3480' }}>
        <Image source={require("../../../../assets/pinoycare.png")} style={styles.imageStyle} />
        <Appbar.Content title="Feeds" titleStyle={{ color: 'white' }} />
        <HeaderMessageNotification />
        <HeaderNotification />
      </Appbar.Header>
      <FlashList
        data={initialFeeds}
        renderItem={({ item }) => <FeedsCard feed={item} />}
        keyExtractor={(item) => item.id.toString()}
        estimatedItemSize={200}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FB'
  },
  listContainer: {
    marginTop: 10
  },
  imageStyle: {
    width: 30,
    height: 30,
    marginLeft: 10,
    marginRight: 10
  }
});

export default Feeds;
