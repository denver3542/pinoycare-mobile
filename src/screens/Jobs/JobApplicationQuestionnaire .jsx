import InputField from "../../components/DynamicCustomInputField";
import React, { useState, useEffect } from "react";
import { ScrollView, View, Text } from "react-native";
import { Button, Appbar } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import { submitApplication } from "./hook/useJob";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserApplications } from "../../components/useUserApplications";

const JobApplicationQuestionnaire = () => {
  const navigation = useNavigation();
  const [isSending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const { addAppliedJob } = useUserApplications();
  const queryClient = useQueryClient();
  const { params } = useRoute();
  const jobID = params.jobData.id;
  const questions = params.jobData.question || [];

  useEffect(() => {
    console.log("Number of Questions:", questions.length);
    console.log("Questions:", questions);
  }, [questions]);

  const [answers, setAnswers] = useState({});

  const handleChange = (id, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [id]: value,
    }));
  };

  const mutation = useMutation(submitApplication, {
    onSuccess: (data) => {
      console.log("Submission successful!", data);
      queryClient.invalidateQueries([`job_${jobID}`]);
      addAppliedJob(jobID);
      navigation.goBack();
    },
    onError: (error) => {
      console.error("Submission error:", error);
      setErrorMessage("An error occurred while submitting the application.");
    },
  });

  const handleSubmit = async () => {
    setSending(true);
    setErrorMessage("");
    setValidationErrors({});

    try {
      const requiredQuestions = questions.filter((question) => question.is_required);
      const errors = {};

      requiredQuestions.forEach((question) => {
        if (!answers[question.id]) {
          errors[question.id] = `The field "${question.question}" is required.`;
        }
      });

      if (Object.keys(errors).length > 0) {
        console.log("Validation Errors:", errors);
        setValidationErrors(errors);
        setErrorMessage("Please correct the errors below.");
        setSending(false);
        return;
      }

      console.log("All required questions answered.");
      console.log("Submitting application with the following data:");

      const formattedAnswers = questions.map((question) => ({
        id: question.id,
        question_answer: answers[question.id],
      }));

      const payload = { id: jobID, questions: formattedAnswers };

      console.log("Payload:", payload);

      const res = await mutation.mutateAsync(payload);

      if (res.success) {
        console.log("Submission successful!");
        queryClient.invalidateQueries([`job_${jobID}`]);
        addAppliedJob(jobID);
        // navigation.goBack();
      } else {
        console.error("Submission error:", res.error);
        setErrorMessage("Failed to submit application.");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      setErrorMessage("An error occurred while submitting the application.");
    }

    setSending(false);
  };



  return (
    <>
      <Appbar.Header style={{ backgroundColor: '#0A3480' }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="white" />
        <Appbar.Content title="Job Application Questionnaire" color="white" />
      </Appbar.Header>
      <ScrollView style={{ flex: 1, padding: 16 }}>
        {questions.map((question) => (
          <InputField
            key={question.id}
            question={question}
            value={answers[question.id] || ""}
            onChange={(value) => handleChange(question.id, value)}
            error={validationErrors[question.id]}
          />
        ))}
        {errorMessage ? (
          <Text style={{ color: "red", }}>{errorMessage}</Text>
        ) : null}
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={{ marginTop: 20 }}
          loading={isSending || mutation.isLoading} // Consider mutation.isLoading
        >
          Submit Answers
        </Button>
      </ScrollView>
    </>
  );
};

export default JobApplicationQuestionnaire;
