import React from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView } from "react-native";
import { Card, Button, Avatar, useTheme } from "react-native-paper";
import useCandidates from "./hooks/useCandidates";
import Spinner from "react-native-loading-spinner-overlay";

const AppliedCandidatesScreen = ({ navigation }) => {
  const { data: appliedCandidates, isFetching } = useCandidates();
  const { colors } = useTheme();
  console.log(!isFetching && appliedCandidates);

  const renderItem = ({ item }) => {
    const candidate = item.creator;
    return (
      <Card style={styles.card} elevation={2}>
        {/* Wrap the content with a View that has overflow: 'hidden' */}
        <View style={styles.cardContentWrapper}>
          <View style={styles.cardContent}>
            <Avatar.Text
              size={48}
              label={candidate.firstname[0] + candidate.lastname[0]}
              style={[styles.avatar, { backgroundColor: colors.accent }]}
            />
            <View style={styles.infoContainer}>
              <Text style={styles.name}>
                {candidate.firstname} {candidate.lastname}
              </Text>
              <Text style={styles.info}>
                Profession: {candidate.profession}
              </Text>
              <Text style={styles.jobPosition}>
                Applied for: {candidate.profession}
              </Text>
            </View>
          </View>
          <Card.Actions
            style={[styles.cardActions, { backgroundColor: colors.primary }]}
          >
            <Button
              mode="contained-tonal"
              onPress={() =>
                navigation.navigate("CandidateDetails", { candidate })
              }
            >
              View Details
            </Button>
          </Card.Actions>
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Spinner visible={isFetching} />
      {!isFetching && (
        <FlatList
          data={appliedCandidates}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  cardContentWrapper: {
    borderRadius: 12,
    overflow: "hidden", // Apply overflow: 'hidden' here
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  avatar: {
    // backgroundColor can be set dynamically in the component
  },
  infoContainer: {
    marginLeft: 16,
    flexShrink: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  info: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  cardActions: {
    justifyContent: "flex-end",
    paddingRight: 16,
    paddingBottom: 16,
    paddingLeft: 16,
  },
  viewButton: {
    borderWidth: 1,
    // borderColor can be set dynamically in the component
  },
  listContent: {
    paddingBottom: 16,
  },
  jobPosition: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
});

export default AppliedCandidatesScreen;
