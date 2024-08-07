import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  Button,
  Card,
  Chip,
  Divider,
  IconButton,
  Text,
  Title,
} from "react-native-paper";
import HTMLView from "react-native-htmlview";
import { fDate } from "../../../../utils/formatTime";
import { addCommasToNumber } from "../../../../utils/currencyFormat";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Job({ job }) {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(!isSaved);
    console.log("save job");
  };

  const handleApply = () => {
    console.log("apply job");
  };

  const banner = job.media
    ? { uri: job.media[0].original_url }
    : require("../../../../assets/images/sample-profile.jpg");
  return (
    <Card style={styles.card}>
      <Card.Content>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Title style={styles.title}>{job.title}</Title>
            <Text style={styles.company}>{job.company}</Text>
            <View style={styles.metaContainer}>
              <Text style={styles.metaText}>
                <Text style={styles.metaIcon}>📅</Text> {fDate(job.created_at)}
              </Text>
            </View>
          </View>
          <View style={styles.cardActions}>
            <IconButton
              icon={isSaved ? "heart" : "heart-outline"}
              onPress={handleSave}
            />
          </View>
        </View>
        <Divider style={styles.divider} />
        <Text style={styles.sectionTitle}>Description:</Text>
        <HTMLView value={job.description} style={styles.description} />
        <Divider style={styles.divider} />
        <Divider style={styles.divider} />
        <Text style={styles.sectionTitle}>Skills</Text>
        <View style={styles.chipContainer}>
          {job.skills &&
            job.skills?.map((item) => (
              <Chip key={item.id} style={styles.skillChip}>
                {item.skill_name}
              </Chip>
            ))}
        </View>
        <Text style={styles.sectionTitle}>Shift and Schedule</Text>
        <View style={styles.chipContainer}>
          {job.schedules?.length > 0 ? (
            job.schedules?.map((item) => (
              <Chip key={item} style={styles.skillChip}>
                {item}
              </Chip>
            ))
          ) : (
            <Text>N/A</Text>
          )}
        </View>
      </Card.Content>
      <Card.Actions style={styles.cardActions}></Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  appbar: {
    backgroundColor: "#0A3480",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  card: {
    margin: 5,
    elevation: 5,
  },
  cardActions: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  saveButton: {},
  applyButton: {
    backgroundColor: "#0A3480",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  company: {
    fontSize: 16,
    marginBottom: 10,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaIcon: {
    fontSize: 16,
  },
  metaText: {
    fontSize: 14,
    marginLeft: 5,
  },
  divider: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  description: {
    marginTop: 5,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 5,
    marginBottom: 0,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
  },
  skillChip: {
    margin: 2,
  },
});
