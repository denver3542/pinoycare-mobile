import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const RecentJobCard = ({ jobTitle, type, location, imageUrl }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.jobImage} />
        ) : (
          <Image
            source={require("../../assets/images/hero-bg.jpg")}
            style={styles.jobImage}
          />
        )}
        <View style={styles.jobDetails}>
          <Text style={styles.jobTitle}>{jobTitle}</Text>
          <Text style={styles.type}>{type}</Text>
          <Text style={styles.location}>{location}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    elevation: 0.5,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",

    // shadowOpacity: 10,
    // shadowRadius: 50,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  jobImage: {
    width: 60,
    height: 60,
    borderRadius: 15,
    marginRight: 15,
  },
  jobDetails: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
  },
  type: {
    fontSize: 16,
    color: "#555",
  },
  location: {
    fontSize: 14,
    color: "#888",
  },
});

export default RecentJobCard;
