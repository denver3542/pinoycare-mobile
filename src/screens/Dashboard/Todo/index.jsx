import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { TouchableHighlight } from "@gorhom/bottom-sheet";

const TodoCard = () => {
  const navigation = useNavigation();

  return (
    <TouchableHighlight
      onPress={() => navigation.navigate("TodoList")}
      underlayColor="#ddd"
    >
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.textContainer}>
            <Text style={styles.headerTextStyle}>Create Your Vision</Text>
            <Text style={styles.headerTextStyle}>Your Today's Task</Text>
            <TouchableHighlight
              style={styles.button}
              onPress={() => navigation.navigate("TodoList")}
              underlayColor="#ddd"
            >
              <Text style={styles.buttonText}>View To Do</Text>
            </TouchableHighlight>
          </View>
          <MaterialIcons name="emoji-events" size={100} color="#FFD700" />
        </View>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 25,
    backgroundColor: "#0A3480",
    borderRadius: 14,
    justifyContent: "center",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  headerTextStyle: {
    fontSize: 20,
    fontWeight: "500",
    color: "white",
  },
  button: {
    marginTop: 10,
    backgroundColor: "white",
    paddingVertical: 6,
    alignItems: "center",
    width: 100,
    borderRadius: 8,
  },
  buttonText: {
    color: "#0A3480",
    fontWeight: "bold",
    fontSize: 14,
  },
  progressContainer: {
    marginLeft: 10,
    right: 10,
    alignItems: "center",
  },
  percentage: {
    fontSize: 16,
    color: "white",
    marginTop: 5,
  },
});

export default TodoCard;
