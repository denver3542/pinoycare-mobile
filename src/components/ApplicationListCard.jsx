import React from "react";
import { View, Image, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Touchable } from "react-native";
import logo from "../../assets/images/hero-bg.jpg";
import { Button, Card, TouchableRipple, useTheme, Divider, Chip, Text } from "react-native-paper";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from "@react-navigation/native";
import Job from "../screens/Jobs/Job";

const ApplicationListCard = ({ application }) => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  // Function to format salary with Peso sign
  const formatSalary = (amount) => {
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
  };

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
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', }}>
              {/* Convert the workplace and type into chips */}
              <Chip style={styles.chip}
                mode="outlined"
                compact
                textStyle={{
                  color: 'black',
                  fontSize: 10,
                  fontWeight: 'bold',
                  minHeight: 10,
                  lineHeight: 10,
                  marginRight: 10,
                  marginLeft: 10,
                  alignItems: "center",
                  marginVertical: 4
                }}>
                {application.job.workplace}
              </Chip>
              <Chip style={styles.chip}
                mode="outlined"
                compact
                textStyle={{
                  color: 'black',
                  fontSize: 10,
                  fontWeight: 'bold',
                  minHeight: 10,
                  lineHeight: 10,
                  marginRight: 10,
                  marginLeft: 10,
                  alignItems: "center",
                  marginVertical: 4
                }}>
                {application.job.type}
              </Chip>
            </View>
            <Text style={styles.salaryText}>{formatSalary(application.job.salary_from)} - {formatSalary(application.job.salary_to)} / Monthly</Text>
            {/* <View style={styles.chipContainer}>
              <Chip textStyle={styles.tiny} mode="outlined" ><Text style={{ fontSize: 10, fontWeight: 'bold' }}>{application.job.workplace}</Text></Chip>
            </View> */}
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
    // elevation: 0.5,
    padding: 8,
    marginBottom: 8,
    // shadowColor: "#000",
    // shadowOpacity: 10,
    // shadowRadius: 50,
  },
  chip: {
    margin: 4,
    borderRadius: 5,
  },
  cardContent: {
    flexDirection: "row",
    // alignItems: "center",
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
    // color: '#0A3480'
  },
  type: {
    fontSize: 16,
    color: "#555",
  },
  location: {
    fontSize: 12,
  },
  divider: {
    marginVertical: 5
  },
  chipContainer: {
    flexWrap: "wrap",
    marginTop: 5
  },
  tiny: {
    marginVertical: 2,
    marginHorizontal: 4,
    paddingHorizontal: 4,
    marginRight: 2,
    marginLeft: 2,
    minHeight: 20,
    lineHeight: 20,
  },

});

export default ApplicationListCard;
