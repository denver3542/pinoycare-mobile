import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import {
  Appbar,
  Avatar,
  Badge,
  Button,
  Card,
  Paragraph,
  Title,
  useTheme,
} from "react-native-paper";

const CandidateDetailsScreen = ({ route }) => {
  const { candidate } = route.params;
  const navigation = useNavigation();
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appBar}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Candidate Details" />
        <Appbar.Action icon="calendar" onPress={() => {}} />
        <Appbar.Action icon="magnify" onPress={() => {}} />
      </Appbar.Header>
      <Card style={styles.card}>
        <Card.Title
          title={`${candidate.firstname} ${candidate.middlename[0]}. ${candidate.lastname}`}
          subtitle={candidate.profession}
          left={(props) => (
            <Avatar.Text {...props} size={48} label={candidate.firstname[0]} />
          )}
          right={(props) =>
            candidate.is_verified ? (
              <Badge
                {...props}
                visible
                size={12}
                style={styles.verifiedBadge}
              />
            ) : null
          }
          titleStyle={styles.cardTitle}
          subtitleStyle={styles.cardSubtitle}
        />
        <Card.Content>
          <Title style={styles.aboutTitle}>About Me</Title>
          <Paragraph style={styles.aboutText}>{candidate.about_me}</Paragraph>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Current Address:</Text>
            <Text style={styles.infoText}>{candidate.current_address}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoText}>{candidate.email}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoText}>{candidate.phone}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Preferred Rate:</Text>
            <Text style={styles.infoText}>${candidate.preferred_rate}</Text>
          </View>
        </Card.Content>
      </Card>
      <View style={styles.socialSection}>
        <Title style={styles.socialTitle}>Connect</Title>
        <View style={styles.socialContainer}>
          <Avatar.Icon
            size={48}
            icon="facebook"
            style={[styles.socialIcon, { backgroundColor: colors.facebook }]}
          />
          <Avatar.Icon
            size={48}
            icon="instagram"
            style={[styles.socialIcon, { backgroundColor: colors.instagram }]}
          />
          <Avatar.Icon
            size={48}
            icon="linkedin"
            style={[styles.socialIcon, { backgroundColor: colors.linkedin }]}
          />
          <Avatar.Icon
            size={48}
            icon="twitter"
            style={[styles.socialIcon, { backgroundColor: colors.twitter }]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  appBar: {
    backgroundColor: "#fff",
    elevation: 2,
    shadowOpacity: 0.1,
    borderBottomWidth: Platform.OS === "ios" ? StyleSheet.hairlineWidth : 0,
    borderBottomColor: "#dcdcdc",
  },
  card: {
    margin: 16,
    elevation: 2,
    borderRadius: 8,
    shadowOpacity: 0.1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "500",
  },
  cardSubtitle: {
    color: "#666",
    fontSize: 14,
  },
  aboutTitle: {
    fontWeight: "500",
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#444",
  },
  infoContainer: {
    flexDirection: "column",
    marginVertical: 4,
  },
  infoLabel: {
    color: "#888",
    fontSize: 14,
    marginBottom: 2,
  },
  infoText: {
    fontSize: 16,
    color: "#333",
  },
  socialSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  socialTitle: {
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 16,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  socialIcon: {
    elevation: 2,
    shadowOpacity: 0.1,
  },
  verifiedBadge: {
    alignSelf: "center",
    backgroundColor: "green",
    borderWidth: 0,
  },
});

// // Define your theme colors
// const theme = {
//   ...DefaultTheme,
//   colors: {
//     ...DefaultTheme.colors,
//     facebook: "#3b5998",
//     instagram: "#C13584",
//     linkedin: "#0077b5",
//     twitter: "#1DA1F2",
//   },
// };

export default CandidateDetailsScreen;
