import React from "react";
import { View, Image, StyleSheet, TouchableWithoutFeedback } from "react-native";
import logo from "../../assets/images/hero-bg.jpg";
import { Divider, Chip, Text } from "react-native-paper";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from "@react-navigation/native";

const ApplicationListCard = ({ application }) => {
  const navigation = useNavigation();

  // Function to format salary with Peso sign
  const formatSalary = (amount) => {
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
  };

  // Check if application and application.job are defined
  if (!application || !application.job) {
    return null; // or a fallback UI element
  }

  return (
    <TouchableWithoutFeedback onPress={() => navigation.navigate("Job", application)}>
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Image
            source={{
              uri: application && application.job && application.job.media && application.job.media.length > 0
                ? application.job.media[0].original_url
                : logo,
            }}
            style={styles.jobImage}
          />
          <View style={styles.jobDetails}>
            {application && application.job && (
              <>
                <Text style={styles.jobTitle}>{application.job.title}</Text>
                <Text style={styles.company}>{application.job.company}</Text>
                <Text style={styles.location}>
                  <MaterialIcons name="location-on" size={14} color="#0A3480" />
                  {application.job.location}
                </Text>
              </>
            )}
            <Divider style={styles.divider} />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', }}>
              <Chip style={styles.chip}
                mode="outlined"
                compact
                textStyle={styles.chipText}>
                {application.job.workplace}
              </Chip>
              <Chip style={styles.chip}
                mode="outlined"
                compact
                textStyle={styles.chipText}>
                {application.job.type}
              </Chip>
            </View>
            <Text style={styles.salaryText}>{formatSalary(application.job.salary_from)} - {formatSalary(application.job.salary_to)} / Monthly</Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  chip: {
    margin: 4,
    borderRadius: 5,
  },
  chipText: {
    color: 'black',
    fontSize: 10,
    fontWeight: 'bold',
    minHeight: 10,
    lineHeight: 10,
    marginHorizontal: 10,
    alignItems: "center",
    marginVertical: 4
  },
  cardContent: {
    flexDirection: "row",
  },
  jobImage: {
    width: 80,
    height: 80,
    borderRadius: 6,
    marginRight: 15
  },
  jobDetails: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  company: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'gray'
  },
  salaryText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  location: {
    fontSize: 12,
  },
  divider: {
    marginVertical: 5
  },
});

export default ApplicationListCard;
