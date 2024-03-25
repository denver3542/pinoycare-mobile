import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { Chip, Button, Appbar, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { useUser } from '../../../hooks/useUser';
import useSkills from './Skills/hooks/useSkills';
import Spinner from 'react-native-loading-spinner-overlay';
import AuthenticatedLayout from '../../../Layout/User/Unauthorize/AuthenticatedLayout';
import CustomTextInput from '../../../components/CustomTextInput';

const AddSkillScreen = () => {
  const { user } = useUser();
  const navigation = useNavigation();
  const { control, handleSubmit, setValue, getValues } = useForm({
    defaultValues: {
      skill_name: user?.skill_name || '',
    },
  });
  const { mutate, isLoading } = useSkills();
  const [tags, setTags] = useState([]);

  const addTag = () => {
    const text = getValues('skill_name');
    if (text && !tags.includes(text)) {
      setTags(prevTags => [...prevTags, text]);
      setValue('skill_name', '');
    }
  };

  const removeTag = (index) => {
    setTags(prevTags => prevTags.filter((_, i) => i !== index));
  };

  const onSubmit = async () => {
    await mutate({ skills: tags });
  };

  return (
    <AuthenticatedLayout>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Add Skill" />
      </Appbar.Header>
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.headerText}>Professional Skills</Text>
          <CustomTextInput
            placeholder="Add Skill"
            control={control}
            label="Skill Name"
            mode="outlined"
            name="skill_name"
            onSubmitEditing={addTag}
          />
          <View style={styles.chipContainer}>
            {tags.map((tag, index) => (
              <Chip key={`tag-${index}`} onClose={() => removeTag(index)} style={styles.chip}>
                {tag}
              </Chip>
            ))}
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <Button mode="outlined" onPress={addTag} style={styles.button}>Add</Button>
          <Button mode="contained" onPress={onSubmit} style={styles.button}>Save</Button>
        </View>
      </View>
      <Spinner visible={isLoading} />
    </AuthenticatedLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between'
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#0A3480',
    marginBottom: 40,
    marginTop: 60
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
