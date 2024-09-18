import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";

function HeaderNotification({ undreadNotificationCount }) {
  const navigation = useNavigation();
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        style={{ position: "relative" }}
        onPress={() => {
          navigation.navigate("NotificationsList");
        }}
      >
        <View style={{ position: "relative" }}>
          <FontAwesome5
            name={"bell"}
            color={"white"}
            size={20}
            style={{ marginTop: 5 }}
          />
          {/* {undreadNotificationCount && (
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
          )} */}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingRight: 20,
  },
});

export default HeaderNotification;
