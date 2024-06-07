import React from "react";
import { View, Text } from "react-native";
import { RadioButton, TextInput } from "react-native-paper";

const InputField = ({ question, value, onChange, error }) => {
  return (
    <View style={{ marginBottom: 20 }}>
      {question.type === "text" && (
        <TextInput
          mode="outlined"
          label={question.question}
          value={value}
          onChangeText={onChange}
          placeholder="Type your answer here"
          error={!!error}
        />
      )}
      {question.type === "numeric" && (
        <TextInput
          mode="outlined"
          label={question.question}
          value={value}
          onChangeText={onChange}
          keyboardType="numeric"
          placeholder="Enter a number"
          error={!!error}
        />
      )}
      {question.type === "boolean" && (
        <View>
          <Text>{question.question}</Text>
          <RadioButton.Group onValueChange={onChange} value={value}>
            <View style={{ flexDirection: "row" }}>
              <RadioButton.Item label="Yes" value="true" position="leading" />
              <RadioButton.Item label="No" value="false" position="leading" />
            </View>
          </RadioButton.Group>
        </View>
      )}
      {error && <Text style={{ color: "red" }}>{error}</Text>}
    </View>
  );
};

export default InputField;
