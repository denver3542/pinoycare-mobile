import { useNavigation } from "@react-navigation/native";
import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Appbar, Text } from "react-native-paper";
import ApplicationListCard from "../../components/ApplicationListCard";
import useApplications from "./hook/useApplications";

const Applications = () => {
  const { data, isFetching, isFetched } = useApplications();
  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header mode="small">
        <Appbar.Content title="Job Applications" />
      </Appbar.Header>
      <View style={{ flex: 1 }}>
        <View style={styles.applicationList}>
          {isFetched && data ? (
            data.map((app, key) => (
              <ApplicationListCard key={key} application={app} />
            ))
          ) : (
            <Text style={styles.noJobsText}>No Jobs Available</Text>
          )}
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  headerContainer: {
    backgroundColor: "#0A3480",
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  headerName: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerProfession: {
    color: "white",
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchbar: {
    borderRadius: 20,
    backgroundColor: "white",
    marginVertical: 15,
    marginTop: 20,
  },
  contentStyle: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  sectionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  showAllText: {
    color: "#0A3480",
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginBottom: 10,
  },
  applicationList: {
    marginTop: 10,
  },
  noJobsText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
  },
});

export default Applications;
