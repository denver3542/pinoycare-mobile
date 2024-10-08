import React from "react";
import { StyleSheet, View, Image, TouchableHighlight } from "react-native";
import { Text, Icon } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import logo from "../../../assets/images/hero-bg.jpg";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { useDashboard } from "../Dashboard/hooks/useDashboard";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Badge } from "react-native-elements";
import moment from "moment";

const JobApplicationList = ({ application }) => {
  const navigation = useNavigation();
  const { data: dashboardData } = useDashboard();

  if (!application || !application.job || !dashboardData) {
    return null;
  }

  const { job, updated_at } = application;
  const { title = "n/a", company = "n/a", media = [] } = job;
  const applicationStatus = getApplicationStatus(
    dashboardData.applications,
    job.id
  );
  const badgeColor = getBadgeColor(applicationStatus);
  const badgeTextColor = getBadgeTextColor(applicationStatus);

  const formattedDate = updated_at
    ? moment(updated_at).format("MMM D, YYYY")
    : "";

    const badgeValue = applicationStatus === "hired" ? `Hired - ${formattedDate}` : applicationStatus || "n/a";

  return (
    <TouchableHighlight
      onPress={() =>
        navigation.navigate("ApplicationStatus", { job: application })
      }
      underlayColor="#ddd"
      style={styles.container}
    >
      <>
        <Image
          source={{
            uri: media.length > 0 ? media[0].original_url : logo,
          }}
          style={styles.jobImage}
        />
        <View style={styles.applicationDetails}>
          <View style={{ alignSelf: "flex-start" }}>
            <Text style={styles.appliedProfession}>{title}</Text>
            <Text style={styles.appliedCompany}>{company}</Text>
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <Badge
                 value={badgeValue}
                badgeStyle={[
                  styles.appliedStatusBadge,
                  {
                    backgroundColor: badgeColor,
                    paddingVertical: 10,
                    borderRadius: 4,
                    marginRight: 5
                  },
                ]}
                textStyle={[styles.chipText, { color: badgeTextColor }]}
              /> 
            </View>
           
          </View>
          <View>
          <Icon source="chevron-right" size={25} />
          </View>
        </View>
      </>
    </TouchableHighlight>
  );
};

const getApplicationStatus = (applications, jobId) => {
  const application = applications.find((app) => app.job_id === jobId);
  return application ? application.status : null;
};

const getBadgeColor = (status) => {
  switch (status) {
    case "processing":
      return "#E1ECFF";
    case "interview":
      return "#DBF8F9";
    case "hired":
      return "#E9FBEF";
    case "rejected":
      return "#FEEAEA";
    default:
      return "gray";
  }
};

const getBadgeTextColor = (status) => {
  switch (status) {
    case "processing":
      return "#5690FD";
    case "interview":
      return "#1CA4AA";
    case "hired":
      return "#08BE75";
    case "rejected":
      return "#F85D5B";
    default:
      return "black";
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    // marginBottom: 8,
    padding: 10,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 0.5,
    borderColor: "#ddd",
  },
  // card: {
  //     padding: 4,
  //     flexDirection: 'row',
  //     backgroundColor: 'pink',
  //     justifyContent: 'space-between',
  // },

  appliedProfession: {
    fontSize: 16,
    fontWeight: "bold",
  },
  appliedCompany: {
    fontSize: 13,
  },
  dateText: {
    fontSize: 12,
    color: "#555",
  },
  appliedStatusBadge: {
    fontSize: 12,
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  jobImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 15,
  },
  applicationDetails: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chipText: {
    fontWeight: '500',
    fontSize: 12,
    minHeight: 12,
    lineHeight: 12,
    marginHorizontal: 12,
    alignItems: "center",
    marginVertical: 4,
  },
});

export default JobApplicationList;
