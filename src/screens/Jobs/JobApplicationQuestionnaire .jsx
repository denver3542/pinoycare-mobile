import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, View } from "react-native";
import {
  Button,
  TextInput,
  Text,
  RadioButton,
  Appbar,
} from "react-native-paper";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const ApplicationSchema = yup.object().shape({
  question: yup.array().of(
    yup.object().shape({
      question_answer: yup.string().required("Please answer this question"),
    })
  ),
});

const schema = yup
  .object({
    // Define your form fields validation here
  })
  .required();

const JobApplicationQuestionnaire = () => {
  const navigation = useNavigation();
  const { params } = useRoute();
  const questions = params?.questions || []; // Ensure you have a fallback
  console.log(questions);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: questions.reduce((acc, question) => {
      // Setup default values based on question types
      acc[question.id] = question.type === "boolean" ? "false" : "true";
      return acc;
    }, {}),
  });

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Job Application Questionnaire" />
      </Appbar.Header>
      <ScrollView style={{ flex: 1, padding: 16 }}>
        {questions &&
          questions.map((question) => (
            <View key={question.id} style={{ marginBottom: 20 }}>
              {/* <InputField question={question} control={control} /> */}
            </View>
          ))}
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={{ marginTop: 20 }}
        >
          Submit Answers
        </Button>
      </ScrollView>
    </>
  );
};

const InputField = ({ question, control, errors }) => {
  switch (question.type) {
    case "text":
    case "number":
      return (
        <Controller
          control={control}
          name={question.id}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                mode="outlined"
                label={question.question}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType={
                  question.type === "number" ? "numeric" : "default"
                }
                placeholder={
                  question.type === "number"
                    ? "Enter a number"
                    : "Type your answer here"
                }
              />
              {errors[question.id] && (
                <Text style={{ color: "red" }}>
                  {errors[question.id].message}
                </Text>
              )}
            </>
          )}
        />
      );
    case "boolean":
      return (
        <Controller
          control={control}
          name={question.id}
          render={({ field: { onChange, value } }) => (
            <RadioButton.Group onValueChange={onChange} value={value}>
              <Text>{question.question}</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <RadioButton.Item label="Yes" value="true" position="leading" />
                <RadioButton.Item label="No" value="false" position="leading" />
              </View>
            </RadioButton.Group>
          )}
        />
      );
    default:
      return null;
  }
};

export default JobApplicationQuestionnaire;
