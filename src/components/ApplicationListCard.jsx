import React from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableHighlight,
} from "react-native";
import logo from "../../assets/images/hero-bg.jpg";
import { Divider, Chip, Text, Icon } from "react-native-paper";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

const ApplicationListCard = ({ application }) => {
  const navigation = useNavigation();

  // Function to format salary with Peso sign
  const formatSalary = (amount) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  // Check if application and application.job are defined
  if (!application || !application.job) {
    return null; // or a fallback UI element
  }

  const { job } = application;
  const {
    title,
    company,
    location,
    media,
    workplace,
    type,
    salary_from,
    salary_to,
  } = job;

  return (
    <TouchableHighlight
      onPress={() => navigation.navigate("Job", application)}
      underlayColor="#ddd"
      style={styles.card}
    >
      <>
        <View style={styles.cardContent}>
          <Image
            source={{
              uri: media && media.length > 0 ? media[0].original_url : logo,
            }}
            style={styles.jobImage}
          />
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text style={styles.jobTitle}>{title || "n/a"}</Text>
              <Text style={styles.company}>{company || "n/a"}</Text>
            </View>
            <Icon source="chevron-right" size={25} />
          </View>
        </View>
      </>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    borderWidth: 0.5,
    borderColor: "#ddd",
  },
  chip: {
    marginRight: 5,
    borderRadius: 5,
    backgroundColor: "#0A3480",
  },
  chipText: {
    color: "white",
    fontSize: 12,
    // fontWeight: 'bold',
    minHeight: 12,
    lineHeight: 12,
    marginHorizontal: 12,
    alignItems: "center",
    marginVertical: 4,
  },
  cardContent: {
    flexDirection: "row",
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
    fontSize: 16,
    // marginBottom: 4,
    fontWeight: "bold",
  },
  company: {
    fontSize: 14,
    // fontWeight: 'bold',
    // color: 'gray',
  },
  salaryText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  location: {
    fontSize: 12,
  },
  divider: {
    marginVertical: 5,
  },
  jobLocation: {},
});

export default ApplicationListCard;
