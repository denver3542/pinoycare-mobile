import React, { useState } from "react";
import { View, StyleSheet, FlatList, RefreshControl, Image } from "react-native";
import { Appbar, useTheme, Snackbar } from "react-native-paper";
import FeedsCard from "./hooks/FeedsCard";
import useFeeds from "./hooks/useFeeds";
import HeaderMessageNotification from "../../../components/HeaderMessageNotification";
import HeaderNotification from "../../../components/HeaderNotification";
import CustomSearchBar from "../../../components/CustomSearchBar";
import { FlashList } from "@shopify/flash-list";


function Feeds({ navigation }) {
  const { colors } = useTheme();
  const { data: feeds, isRefetching, refetch } = useFeeds();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    refetch()
      .then(() => {})
      .catch(() => {})
      .finally(() => {
        setRefreshing(false);
      });
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: '#0A3480' }}>
        <Image source={require("../../../../assets/pinoycare.png")} style={styles.imageStyle} />
        <Appbar.Content title="Feeds" titleStyle={{ color: 'white' }} />
        <CustomSearchBar />
        <HeaderMessageNotification />
        <HeaderNotification />
      </Appbar.Header>
      <FlashList
        data={feeds}
        renderItem={({ item }) => <FeedsCard feed={item} />}
        keyExtractor={(item) => item.id.toString()}
        estimatedItemSize={100} 
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FB'
  },
  listContainer: { marginTop: 10 },
  imageStyle: {
    width: 30, // Adjust width as needed
    height: 30, // Adjust height as needed
    marginLeft: 10, // Adjust margin as needed
    marginRight: 10
  },
});

export default Feeds;
