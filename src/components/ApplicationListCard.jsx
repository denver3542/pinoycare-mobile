import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import logo from "../../assets/images/hero-bg.jpg";
import { Button, Card, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Job from "../screens/Jobs/Job";

const ApplicationListCard = ({ application }) => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  return (
    <TouchableOpacity onPress={() => navigation.navigate("Job", application)}>
      <Card elevation={1} style={styles.card}>
        <View style={styles.cardContent}>
          <Image
            source={{
              uri:
                application.job.media.length > 0
                  ? application.job.media[0].original_url
                  : logo,
            }}
            style={styles.jobImage}
          />
          <View style={styles.jobDetails}>
            <Text style={styles.jobTitle}>{application.job.title}</Text>
            <Text style={styles.type}>{application.job.status}</Text>
            <Text style={styles.location}>{application.job.location}</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    elevation: 0.5,
    padding: 15,
    marginBottom: 8,
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

export default ApplicationListCard;
