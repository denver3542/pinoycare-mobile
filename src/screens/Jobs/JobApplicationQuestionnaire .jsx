import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { Button, Appbar } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import { useSubmitApplication } from "./hook/useJob";
import { useUserApplications } from "../../components/useUserApplications";
import InputField from "../../components/DynamicCustomInputField";

const JobApplicationQuestionnaire = () => {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { job } = params;

  const questions = useMemo(() => job.question || [], [job.question]);
  const jobID = job.id;

  const [isSending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [answers, setAnswers] = useState(
    () => Object.fromEntries(questions.map((q) => [q.id, ""]))
  );

  const { addAppliedJob } = useUserApplications();
  const mutation = useSubmitApplication();

  const isSubmitDisabled = useMemo(() => {
    const allRequiredFilled = questions.every(
      (q) => !q.is_required || answers[q.id]?.trim() !== ""
    );
    const allQuestionsAnswered = Object.values(answers).every(
      (ans) => ans?.trim() !== ""
    );
    return !allRequiredFilled || !allQuestionsAnswered;
  }, [answers, questions]);

  const handleChange = useCallback((id, value) => {
    setAnswers((prevAnswers) => ({ ...prevAnswers, [id]: value }));
  }, []);

  const handleSubmit = async () => {
    setSending(true);
    setErrorMessage("");
    setValidationErrors({});

    const formattedAnswers = questions
      .filter((q) => answers[q.id]?.trim())
      .map((q) => ({
        id: q.id,
        question_answer: answers[q.id],
      }));

    if (!formattedAnswers.length) {
      setErrorMessage("Please answer the required questions.");
      setSending(false);
      return;
    }

    const payload = { id: jobID, questions: formattedAnswers };
    console.log("Payload being sent:", payload);

    try {
      await mutation.mutateAsync(payload);
      navigation.navigate("Dashboard");
      addAppliedJob(jobID);
    } catch (error) {
      console.error("Error submitting application:", error);
      setErrorMessage("An error occurred while submitting the application.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="white" />
        <Appbar.Content title="Job Application Questionnaire" color="white" />
      </Appbar.Header>
      <ScrollView style={styles.container}>
        {questions.map((q, index) => (
          <View key={q.id}>
            <Text style={styles.questionText}>
              {`${index + 1}. ${q.question}`}
            </Text>
            <InputField
              question={q}
              value={answers[q.id] || ""}
              onChange={(value) => handleChange(q.id, value)}
              error={validationErrors[q.id]}
            />
          </View>
        ))}
        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}
          disabled={isSending || mutation.isLoading || isSubmitDisabled}
        >
          {isSending || mutation.isLoading ? "Submitting..." : "Submit Answers"}
        </Button>
      </ScrollView>
    </>
  );
};

export default JobApplicationQuestionnaire;

const styles = StyleSheet.create({
  header: { backgroundColor: "#0A3480" },
  container: { flex: 1, padding: 16, backgroundColor: "#F4F7FB" },
  errorText: { color: "red", marginTop: 10 },
  submitButton: { marginTop: 20 },
  questionText: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
});
