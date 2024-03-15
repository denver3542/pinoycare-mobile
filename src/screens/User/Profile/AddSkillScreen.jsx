import React, { useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Keyboard } from 'react-native'; // Import Keyboard
import { Chip, Button, Appbar, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { useUser } from '../../../hooks/useUser';
import AuthenticatedLayout from '../../../Layout/User/Unauthorize/AuthenticatedLayout';
import CustomTextInput from '../../../components/CustomTextInput';

const AddSkillScreen = () => {
  const { user } = useUser();
  const navigation = useNavigation();
  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      skill_name: user?.skill_name || '',
    },
  });

  const initialTags = useMemo(() => [
    'Leadership',
    'Teamwork',
    'Visionary',
    'Target oriented',
    'Consistent',
    'Good communication skills',
    'English',
    'Responsibility'
  ], []);

  const [tags, setTags] = useState(initialTags);
  const [text, setText] = useState('');

  const addTag = useCallback(() => {
    if (text && !tags.includes(text)) {
      setTags(prevTags => [...prevTags, text]);
      setText('');
    }
  }, [text, tags]);

  const removeTag = useCallback((index) => {
    setTags(prevTags => prevTags.filter((_, i) => i !== index));
  }, []);

  const onSave = useCallback(() => {
    // Implement your save logic here
    console.log('Tags to save: ', tags);
  }, [tags]);

  return (
    <AuthenticatedLayout>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Add Skill" />
      </Appbar.Header>
      <View style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : null} keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}>
        <ScrollView>
          <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#0A3480', marginBottom: 40, marginTop: 60 }}>Professional Skills</Text>
          <CustomTextInput
            placeholder="Search skills"
            value={text}
            control={control}
            name="skill_name"
            onChangeText={setText}
            onSubmitEditing={addTag}
          />
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
        </ScrollView>
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
    padding: 10,
    justifyContent: 'space-between'
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
    marginTop: 'auto',
  },
  button: {
    flexGrow: 1,
    marginHorizontal: 4,
  },
});

export default AddSkillScreen;
