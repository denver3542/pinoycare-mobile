import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Touchable } from "react-native";
import logo from "../../assets/images/hero-bg.jpg";
import { Button, Card, TouchableRipple, useTheme, Divider, Chip } from "react-native-paper";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from "@react-navigation/native";
import Job from "../screens/Jobs/Job";

const ApplicationListCard = ({ application }) => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  return (
    <TouchableWithoutFeedback onPress={() => navigation.navigate("Job", application)}>
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Image
            source={{
              uri: application.job.media
                ? application.job.media[0].original_url
                : logo,
            }}
            style={styles.jobImage}
          />
          <View style={styles.jobDetails}>
            <Text style={styles.jobTitle}>{application.job.title}</Text>
            <Text style={styles.company}>{application.job.company}</Text>
            {/* <Text style={styles.type}>{application.job.status}</Text> */}
            <Divider style={styles.divider} />
            <Text style={styles.location}><MaterialIcons name="location-on" size={14} color="#0A3480" />{application.job.location}</Text>
            <Text style={styles.company}>{application.job.salary_from} - {application.job.salary_to}</Text>
            <View style={styles.chipContainer}>
              <Chip style={styles.skillChip} mode="outlined">{application.job.workplace}</Chip>
            </View>
            {/* <Text style={styles.company}>{application.job.workplace}</Text> */}
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
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

    shadowOpacity: 10,
    shadowRadius: 50,
  },
  cardContent: {
    flexDirection: "row",
    // alignItems: "center",
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
  divider: {
    marginVertical: 5
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});

export default ApplicationListCard;
