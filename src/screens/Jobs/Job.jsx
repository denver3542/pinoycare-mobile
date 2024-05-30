import React, { useEffect, useState } from "react";
import RenderHtml from 'react-native-render-html';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl, useWindowDimensions
} from "react-native";
import {
  useNavigation,
  useRoute
} from '@react-navigation/native';
import {
  Appbar,
  Button,
  Card,
  Chip,
  Divider,
  Modal,
  Text,
  Title,
  useTheme,
  Portal
} from "react-native-paper";
import {
  fDate
} from "../../../utils/formatTime";
import {
  addCommasToNumber
} from "../../../utils/currencyFormat";
import {
  useUser
} from "../../hooks/useUser";
import useJob from "./hook/useJob";
import {
  useUserApplications
} from "../../components/useUserApplications";

export default function Job() {
  const { colors } = useTheme();
  const { params } = useRoute();
  const job = params?.job || {};
  const navigation = useNavigation();
  const { user, isFetched } = useUser();
  const { appliedJobs } = useUserApplications();
  const [isApplied, setIsApplied] = useState(false);
  const [questions, setQuestions] = useState([]);
  const { data: jobData, isFetching, refetch, isRefetching } = useJob(job.uuid);
  const [refreshing, setRefreshing] = useState(false);
  const [visible, setVisible] = useState(false);
  const { width: contentWidth } = useWindowDimensions();

  const onRefresh = () => {
    setRefreshing(true);
    refetch()
      .then(() => { })
      .catch(() => { })
      .finally(() => {
        setRefreshing(false);
      });
  };

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  useEffect(() => {
    if (appliedJobs && job.id) {
      setIsApplied(appliedJobs.includes(job.id));
    }
  }, [appliedJobs, job.id]);

  useEffect(() => {
    if (user && isFetched) {
      const appliedJob = user.applications?.find(
        (app) => app.job_id === job.id
      );
      setIsApplied(!!appliedJob);
    }
  }, [user, isFetched]);

  useEffect(() => {
    if (jobData && !isFetching) {
      setQuestions(jobData.question || []);
    }
  }, [jobData, isFetching]);

  const handleSave = () => {
    showModal(true);
  };

  const handleApply = () => {
    if (user) {
      navigation.navigate("Questionnaire", { jobData });
      console.log('user:', user);
    } else {
      showModal(true);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.primary]}
          progressViewOffset={100}
        />
      }
    >
      <Appbar.Header style={{ backgroundColor: '#0A3480' }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="white" />
        <Appbar.Content title={job.title || "Job Details"} titleStyle={{ color: 'white' }} />
      </Appbar.Header>
      <Card style={styles.card}>
        {job.media && job.media[0] && job.media[0].original_url && (
          <Card.Cover source={{ uri: job.media[0].original_url }} />
        )}
        <Card.Actions style={styles.cardActions}>
          {!user && !isFetched && (
            <Button icon="" style={styles.saveButton} onPress={handleSave}>
              Save
            </Button>
          )}
          <Button
            style={[
              { color: isApplied ? "#fff" : "primary" },
            ]}
            onPress={handleApply}
            disabled={isApplied}
          >
            {isApplied ? "Applied" : "Apply"}
          </Button>
        </Card.Actions>
        <Card.Content>
          <Title style={styles.title}>{job.title || "No Title Available"}</Title>
          <Text style={styles.company}>{job.company || "No Company Information"}</Text>
          <View style={styles.metaContainer}>
            <Text style={styles.metaText}>
              <Text style={styles.metaIcon}>📅</Text> {job.created_at ? fDate(job.created_at) : "N/A"}
            </Text>
          </View>
          <Divider style={styles.divider} />
          <Text style={styles.sectionTitle}>Description</Text>
          {/* <RenderHtml enableExperimentalBRCollapsing={true} source={{ html: job.description }} contentWidth={contentWidth} tagsStyles={{ p: { textAlign: 'justify' } }} /> */}
          <RenderHtml
            contentWidth={contentWidth}
            source={{ html: `<div style="text-align: justify;">${job.description}</div>` }}
          />
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
            {job.skills && job.skills.length > 0 ? (
              job.skills.map((item) => (
                <Chip key={item.id} style={styles.skillChip}>
                  {item.skill_name}
                </Chip>
              ))
            ) : (
              <Text>N/A</Text>
            )}
          </View>
          <Text style={styles.sectionTitle}>Shift and Schedule</Text>
          <View style={styles.chipContainer}>
            {job.schedules && job.schedules.length > 0 ? (
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
      {user && isFetched ? null : (
        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={styles.modal}
          >
            <Text style={styles.modalText}>
              Would you like to apply for this job? Please sign in.
            </Text>
            <Button
              mode="contained"
              onPress={() => {
                navigation.navigate("Login");
                hideModal();
              }}
            >
              Sign in
            </Button>

            <Button style={styles.button} onPress={hideModal}>Cancel</Button>
          </Modal>
        </Portal>
      )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FB'
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20
  },
  button: {
    marginTop: 10,
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
    textAlign: 'justify',
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
  a: {
    fontWeight: '300',
    color: 'red', // make links coloured pink
  },
});

