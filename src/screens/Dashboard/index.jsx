import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  Text,
  Searchbar,
  List,
  Divider,
  Button,
  useTheme,
  ActivityIndicator,
  MD2Colors,
} from "react-native-paper";
import AuthenticatedLayout from "../../Layout/User/Unauthorize/AuthenticatedLayout";
import { useUser } from "../../hooks/useUser";
import { useDashboard } from "./hooks/useDashboard";
import ApplicationListCard from "../../components/ApplicationListCard";
import HeaderNotification from "../../components/HeaderNotification";
import HeaderMessageNotification from "../../components/HeaderMessageNotification";
import { useNavigation } from "@react-navigation/native";
import Spinner from "react-native-loading-spinner-overlay";

function Dashboard({ activeNav }) {
  const { colors } = useTheme();
  const { user, isFetching, isLoading } = useUser();
  const { data, isFetched, isFetching: dashboardIsFetching } = useDashboard();
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();

  const handleSeeMore = () => {
    navigation.navigate("Application");
  };

  return (
    <AuthenticatedLayout activeBottomNav={activeNav?.route?.name}>
      {isFetching ? (
        <Spinner visible={isLoading} />
      ) : (
        <ScrollView style={styles.container}>
          <View style={styles.headerContainer}>
            <View style={styles.header}>
              <View style={styles.userInfoContainer}>
                <Image
                  source={
                    user && user.media[0]
                      ? { uri: user.media[0].original_url }
                      : require("../../../assets/images/sample-profile.jpg")
                  }
                  style={styles.profileImage}
                />
                <View>
                  <Text style={styles.headerName}>{user?.firstname || "N/A"} {user?.lastname || "N/A"}</Text>
                  <Text style={styles.headerProfession}>
                    {user?.profession || "N/A"}
                  </Text>
                </View>
              </View>
              <View style={styles.iconsContainer}>
                <HeaderMessageNotification />
                <HeaderNotification />
              </View>
            </View>
            <Searchbar
              placeholder="Search"
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={styles.searchbar}
            />
          </View>

          <View style={styles.contentStyle}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Job Applications</Text>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.applicationList}>
              {dashboardIsFetching && (
                <ActivityIndicator animating={true} color={colors.primary} />
              )}
              {isFetched && data.applications.length > 0 ? (
                data.applications.map((app, key) => (
                  <ApplicationListCard key={key} application={app} />
                ))
              ) : (
                <Text style={styles.noJobsText}>No Jobs Available</Text>
              )}
            </View>
            {isFetched && data.applications.length > 0 ? (
              <View style={{ flex: 1 }}>
                <Button icon="redo" mode="contained" onPress={handleSeeMore}>
                  See more
                </Button>
              </View>
            ) : (
              <></>
            )}
          </View>

          <View style={[styles.contentStyle, { marginTop: 20 }]}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Job Offers</Text>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.applicationList}>
              {dashboardIsFetching && (
                <ActivityIndicator animating={true} color={colors.primary} />
              )}
              {isFetched && data.applications.length > 0 ? (
                data.applications.map((app, key) => (
                  <ApplicationListCard key={key} application={app} />
                ))
              ) : (
                <Text style={styles.noJobsText}>No Jobs Available</Text>
              )}
            </View>
            {isFetched && data.applications.length > 0 ? (
              <View style={{ flex: 1 }}>
                <Button icon="redo" mode="contained" onPress={handleSeeMore}>
                  See more
                </Button>
              </View>
            ) : (
              <></>
            )}
          </View>
        </ScrollView>
      )}
    </AuthenticatedLayout>
  );
}

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

export default Dashboard;
