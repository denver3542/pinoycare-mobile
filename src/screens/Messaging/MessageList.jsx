import { useNavigation } from "@react-navigation/native";
import React from "react";
import { FlatList, View } from "react-native";
import { List, Avatar, Appbar } from "react-native-paper";
import useMessaging from "./hook/useMessaging";

const contacts = [
  // Define your contacts array here
  {
    id: "1",
    name: "Andy Robertson",
    message: "Oh yes, please send your CV/Res...",
    time: "5m ago",
    avatar: "path/to/andy-robertson/avatar",
  },
  {
    id: "2",
    name: "Giorgio Chiellini",
    message: "Hello sir, Good Morning",
    time: "30m ago",
    avatar: "path/to/giorgio-chiellini/avatar",
  },
  {
    id: "3",
    name: "Alex Morgan",
    message: "I saw the UI/UX Designer vac...",
    time: "09:30 am",
    avatar: "path/to/alex-morgan/avatar",
  },
  // ... other contacts
];

const MessageList = () => {
  const navigation = useNavigation();
  const { data } = useMessaging();
  console.log(data && data);
  const renderItem = ({ item }) => (
    <List.Item
      title={item.name}
      description={item.message}
      left={(props) => <Avatar.Image size={48} source={{ uri: item.avatar }} />}
      right={(props) => <List.Icon {...props} icon="message-outline" />}
      onPress={() => navigation.navigate("ChatConversation", { contact: item })}
    />
  );

  return (
    <View>
      <Appbar.Header mode="small">
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Messages" />
      </Appbar.Header>
      <View style={{ padding: 5 }}>
        <FlatList
          data={contacts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => (
            <View style={{ height: 1, backgroundColor: "#f0f0f0" }} />
          )}
        />
      </View>
    </View>
  );
};

export default MessageList;
