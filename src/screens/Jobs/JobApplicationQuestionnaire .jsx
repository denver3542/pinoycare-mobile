import React, { useState, useEffect, useMemo } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { Button, Appbar } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitApplication, useSubmitApplication } from "./hook/useJob";
import { useUserApplications } from "../../components/useUserApplications";
import InputField from "../../components/DynamicCustomInputField";

const JobApplicationQuestionnaire = () => {
  const navigation = useNavigation();
  const { params } = useRoute();
  const questions = useMemo(() => params.job.question || [], [params.job.question]);
  const jobID = params.job.id;

  const [isSending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [answers, setAnswers] = useState({});
  const [questionCount, setQuestionCount] = useState(0);

  const { addAppliedJob } = useUserApplications();
  const queryClient = useQueryClient();
  const mutation = useSubmitApplication();

  useEffect(() => {
    setQuestionCount(questions.length);
  }, [questions]);

  const handleChange = (id, value) => {
    setAnswers(prevAnswers => ({ ...prevAnswers, [id]: value }));
  };

  const handleSubmit = async () => {
    setSending(true);
    setErrorMessage("");
    setValidationErrors({});

    const errors = questions
      .filter(question => question.is_required && !answers[question.id])
      .reduce((acc, question) => {
        acc[question.id] = `The field "${question.question}" is required.`;
        return acc;
      }, {});

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setErrorMessage("Please correct the errors below.");
      setSending(false);
      return;
    }

    const formattedAnswers = questions.map(question => ({
      id: question.id,
      question_answer: answers[question.id],
    }));
    const payload = { id: jobID, questions: formattedAnswers };

    try {
      await mutation.mutateAsync(payload);

      navigation.navigate('Dashboard');
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
        {questions.map((question, index) => (
          <View key={question.id}>
            <Text style={styles.questionText}>{`${index + 1}. ${question.question}`}</Text>
            <InputField
              question={question}
              value={answers[question.id] || ""}
              onChange={value => handleChange(question.id, value)}
              error={validationErrors[question.id]}
            />
          </View>
        ))}
        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}
          loading={isSending || mutation.isLoading}
          disabled={isSending || mutation.isLoading}
        >
          {isSending || mutation.isLoading ? "Submitting..." : "Submit Answers"}
        </Button>
      </ScrollView>
    </>
  );
};

export default JobApplicationQuestionnaire;

const styles = StyleSheet.create({
  header: { backgroundColor: '#0A3480' },
  container: { flex: 1, padding: 16, backgroundColor: "#F4F7FB", },
  errorText: { color: "red", marginTop: 10 },
  submitButton: { marginTop: 20 },
  questionText: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 }
});
