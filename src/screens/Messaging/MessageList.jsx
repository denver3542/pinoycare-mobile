import { useNavigation } from "@react-navigation/native";
import React from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { List, Avatar, Appbar } from "react-native-paper";
import useMessaging from "./hook/useMessaging";
import Spinner from "react-native-loading-spinner-overlay";
import CustomAvatar from "../../components/CustomAvatar";

const MessageList = () => {
  const navigation = useNavigation();
  const { data, isFetching, isFetched, isRefetching, refetch } = useMessaging();

  const renderItem = ({ item }) => {
    const recentMessage =
      item.receivedMessages[item.receivedMessages.length - 1]?.message;
    console.log(recentMessage);
    const isRead =
      item.receivedMessages[item.receivedMessages.length - 1].read_at;

    return (
      <List.Item
        title={`${item.firstname} ${item.lastname}`}
        description={recentMessage}
        left={(props) => (
          <CustomAvatar
            src={item?.media[0]?.original_url}
            name={item.firstname}
          />
        )}
        right={(props) => <List.Icon {...props} icon="message-outline" />}
        onPress={() =>
          navigation.navigate("ChatConversation", { contact: item.user })
        }
        titleStyle={{ fontWeight: isRead ? "600" : "300" }}
        descriptionStyle={{ fontWeight: isRead ? "600" : "300" }}
      />
    );
  };

  return (
    <View>
      {isFetching && <Spinner animation="fade" />}
      <Appbar.Header style={{ backgroundColor: "#0A3480" }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="white" />
        <Appbar.Content title="Messages" titleStyle={{ color: "white" }} />
      </Appbar.Header>
      <View style={{ padding: 5, height: "100%" }}>
        {isFetched && (
          <FlatList
            data={data.users}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => (
              <View style={{ height: 1, backgroundColor: "#f0f0f0" }} />
            )}
            // refreshing={isRefetching}
            // onRefresh={refetch}
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
            }
          />
        )}
      </View>
    </View>
  );
};

export default MessageList;
