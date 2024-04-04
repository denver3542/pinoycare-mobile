import { View } from "react-native";
import { RadioButton, Text } from "react-native-paper";

const InputField = ({ question, value, onChange }) => {
  switch (question.type) {
    case "text":
      return (
        <TextInput
          mode="outlined"
          label={question.question}
          value={value}
          onChangeText={onChange}
          placeholder="Type your answer here"
        />
      );
    case "number":
      return (
        <TextInput
          mode="outlined"
          label={question.question}
          value={value}
          onChangeText={onChange}
          keyboardType="numeric"
          placeholder="Enter a number"
        />
      );
    case "boolean":
      return (
        <RadioButton.Group onValueChange={onChange} value={value}>
          <Text>{question.question}</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <RadioButton.Item label="Yes" value="true" position="leading" />
            <RadioButton.Item label="No" value="false" position="leading" />
          </View>
        </RadioButton.Group>
      );
    default:
      return null;
  }
};

export default InputField;
