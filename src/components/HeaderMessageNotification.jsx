import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";

function HeaderMessageNotification({ unreadMessageCount }) {
  const navigation = useNavigation();
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        style={{ position: "relative" }}
        onPress={() => {
          navigation.navigate("MessageList");
        }}
      >
        <FontAwesome5
          name={"comment-dots"}
          color={"white"}
          size={20}
          style={{ marginTop: 5 }}
        />
        {unreadMessageCount > 0 && (
          <Text
            style={{
              height: 8,
              width: 8,
              backgroundColor: "red",
              borderRadius: 20,
              position: "absolute",
              right: 0,
              bottom: 12,
            }}
          ></Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingRight: 20,
  },
});

export default HeaderMessageNotification;
