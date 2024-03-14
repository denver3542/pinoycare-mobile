import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Chip, Button } from 'react-native-paper';
import CustomTextInput from '../../../components/CustomTextInput';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { useUser } from '../../../hooks/useUser';
import AuthenticatedLayout from '../../../Layout/User/Unauthorize/AuthenticatedLayout';

const AddSkillScreen = () => {

  const { user } = useUser();
  const navigation = useNavigation();
  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      skill_name: user?.skill_name || '',
    },
  });
  const [tags, setTags] = useState([
    'Leadership',
    'Teamwork',
    'Visionary',
    'Target oriented',
    'Consistent',
    'Good communication skills',
    'English',
    'Responsibility'
  ]);
  const [text, setText] = useState('');

  const addTag = () => {
    if (text && !tags.includes(text)) {
      setTags([...tags, text]);
      setText('');
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const onSave = () => {
    // Implement your save logic here
    console.log('Tags to save: ', tags);
  };

  return (
    <AuthenticatedLayout>
      <View style={styles.container}>
        <CustomTextInput
          placeholder="Search skills"
          value={text}
          control={control}
          name="skill_name"
          onChangeText={setText}
          onSubmitEditing={addTag} // Your CustomTextInput needs to handle this prop
        />
        <>
          <View style={styles.chipContainer}>
            {tags.map((tag, index) => (
              <Chip
                key={`tag-${index}`}
                onClose={() => removeTag(index)}
                style={styles.chip}
              >
                {tag}
              </Chip>
            ))}
          </View>
        </>
        <View style={styles.buttonContainer}>
          <Button mode="outlined" onPress={addTag} style={styles.button}>
            Add
          </Button>
          <Button mode="contained" onPress={onSave} style={styles.button}>
            Save
          </Button>
        </View>
      </View>
    </AuthenticatedLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  input: {
    width: '100%',
    marginBottom: 20,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 20,
  },
  chip: {
    margin: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    marginTop: 10,
    flexGrow: 1,
    marginHorizontal: 4,
  },
});

export default AddSkillScreen;