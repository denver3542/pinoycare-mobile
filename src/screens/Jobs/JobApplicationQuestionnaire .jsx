import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, Appbar } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import InputField from "../../components/DynamicCustomInputField";
import { submitApplication } from "./hook/useJob";
import { useQueryClient } from "@tanstack/react-query";
import { useUserApplications } from "../../components/useUserApplications";

const JobApplicationQuestionnaire = () => {
  const navigation = useNavigation();
  const [isSending, setSending] = useState(false);
  const { addAppliedJob } = useUserApplications();

  const queryClient = useQueryClient();

  const { params } = useRoute();

  const jobID = params.jobData.id;
  const questions = params.jobData.question || [];

  const [answers, setAnswers] = React.useState(
    questions.reduce((acc, question) => {
      return acc;
    }, {})
  );

  const handleChange = (id, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [id]: value,
    }));
  };
  const handleSubmit = () => {
    onSubmit(answers);
  };

  const onSubmit = async (data) => {
    setSending(true);
    const dataArray = Object.keys(data).map((key) => ({ [key]: data[key] }));
    const inputData = { data: dataArray, id: jobID };
    console.log(inputData);
    const res = await submitApplication(inputData);
    console.log(res);
    // if (res.data.success === true) {
    // }

    queryClient.invalidateQueries([`job_${jobID}`]);
    addAppliedJob(jobID); // Update the global state
    navigation.goBack();
    setSending(false);
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Job Application Questionnaire" />
      </Appbar.Header>
      <ScrollView style={{ flex: 1, padding: 16 }}>
        {questions.map((question) => (
          <View key={question.id} style={{ marginBottom: 20 }}>
            <InputField
              question={question}
              value={answers[question.id]}
              onChange={(value) => handleChange(question.id, value)}
            />
          </View>
        ))}
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={{ marginTop: 20 }}
          loading={isSending}
        >
          Submit Answers
        </Button>
      </ScrollView>
    </>
  );
};

export default JobApplicationQuestionnaire;
