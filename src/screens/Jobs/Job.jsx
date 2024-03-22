import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import {
  Appbar,
  Button,
  Card,
  Chip,
  Divider,
  Text,
  Title,
} from "react-native-paper";
import HTMLView from "react-native-htmlview";
import { fDate } from "../../../utils/formatTime";
import { addCommasToNumber } from "../../../utils/currencyFormat";

export default function Job() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const job = params.job;

  console.log(job);
  const handleSave = () => {
    console.log("save job");
  };

  const handleApply = () => {
    console.log("apply job");
  };
  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header mode="small">
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={params.job.title} />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.card}>
          <Card.Cover source={{ uri: params.job.media[0].original_url }} />
          <Card.Actions style={styles.cardActions}>
            <Button icon="" style={styles.saveButton} onPress={handleSave}>
              Save
            </Button>
            <Button style={styles.applyButton} onPress={handleApply}>
              Apply
            </Button>
          </Card.Actions>
          <Card.Content>
            <Title style={styles.title}>{job.title}</Title>
            <Text style={styles.company}>{job.company}</Text>
            <View style={styles.metaContainer}>
              <Text style={styles.metaText}>
                <Text style={styles.metaIcon}>📅</Text> {fDate(job.created_at)}
              </Text>
            </View>
            <Divider style={styles.divider} />
            <Text style={styles.sectionTitle}>Description:</Text>
            <HTMLView value={job.description} style={styles.description} />
            <Divider style={styles.divider} />
            <View style={[styles.infoContainer, { alignItems: "baseline" }]}>
              <Text style={styles.sectionTitle}>Offered Salary:</Text>
              <Text variant="bodyLarge" style={styles.infoText}>
                {"₱" + addCommasToNumber(job.salary_from || 0)} -{" "}
                {"₱" + addCommasToNumber(job.salary_to || 0)}
              </Text>
            </View>
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
              {job.schedules.length > 0 ? (
                job.schedules.map((item) => (
                  <Chip key={item} style={styles.skillChip}>
                    {item}
                  </Chip>
                ))
              ) : (
                <Text>N/A</Text>
              )}
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
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
    justifyContent: "space-around",
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
