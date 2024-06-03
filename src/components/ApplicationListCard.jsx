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

  const { job } = application;
  const { title, company, location, media, workplace, type, salary_from, salary_to } = job;

  return (
    <TouchableWithoutFeedback onPress={() => navigation.navigate("Job", application)}>
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View style={{ flexDirection: 'row' }}>
            <Image
              source={{
                uri: media && media.length > 0 ? media[0].original_url : logo,
              }}
              style={styles.jobImage}
            />
            <View style={{ marginBottom: 5 }}>
              <Text style={styles.jobTitle}>{title || 'n/a'}</Text>
              <Text style={styles.company}>{company || 'n/a'}</Text>
            </View>
          </View>
          <Divider style={styles.divider} />
          <View style={{ flexDirection: 'row', left: 65 }}>
            <View style={{ rowGap: 5 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialIcons name="location-on" size={14} color="#0A3480" />
                <Text style={styles.jobLocation}>{location || 'n/a'}</Text>
              </View>
              <Text style={styles.salaryText}>
                {formatSalary(salary_from) || 'N/A'} - {formatSalary(salary_to) || 'N/A'} / month
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                <Chip style={styles.chip} mode="text" compact textStyle={styles.chipText}>
                  {workplace || 'Workplace not available'}
                </Chip>
                <Chip style={styles.chip} mode="text" compact textStyle={styles.chipText}>
                  {type || 'Type not available'}
                </Chip>
              </View>
            </View>
          </View>
          {/* <View style={styles.jobDetails}>
            <Text style={styles.jobTitle}>{title || 'n/a'}</Text>
            <Text style={styles.company}>{company || 'n/a'}</Text>
            <Text style={styles.location}>
              <MaterialIcons name="location-on" size={14} color="#0A3480" />
              {location || 'Location not available'}
            </Text>
            <Divider style={styles.divider} />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              <Chip style={styles.chip} mode="outlined" compact textStyle={styles.chipText}>
                {workplace || 'Workplace not available'}
              </Chip>
              <Chip style={styles.chip} mode="outlined" compact textStyle={styles.chipText}>
                {type || 'Type not available'}
              </Chip>
            </View>
            <Text style={styles.salaryText}>
              {formatSalary(salary_from) || 'N/A'} - {formatSalary(salary_to) || 'N/A'} / Monthly
            </Text>
          </View> */}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F5F5F5",
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
  },
  chip: {
    marginRight: 5,
    borderRadius: 5,
    backgroundColor: '#0A3480',
  },
  chipText: {
    color: 'white',
    fontSize: 12,
    // fontWeight: 'bold',
    minHeight: 12,
    lineHeight: 12,
    marginHorizontal: 12,
    alignItems: "center",
    marginVertical: 4,
  },
  cardContent: {
    // flexDirection: "row",
  },
  jobImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 15,
  },
  jobDetails: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 20,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  company: {
    fontSize: 14,
    // fontWeight: 'bold',
    // color: 'gray',
  },
  salaryText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  location: {
    fontSize: 12,
  },
  divider: {
    marginVertical: 5,
  },
  jobLocation: {}
});

export default ApplicationListCard;
