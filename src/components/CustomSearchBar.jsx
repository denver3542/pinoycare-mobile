import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

function CustomSearchBar() {
  const navigation = useNavigation();
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        style={{ position: "relative" }}
        onPress={() => {
          navigation.navigate("SearchJob");
        }}
      >
        <MaterialIcons
          name="search"
          color="white"
          size={25}
          style={{ marginTop: 5 }}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingRight: 20,
  },
});

export default CustomSearchBar;
