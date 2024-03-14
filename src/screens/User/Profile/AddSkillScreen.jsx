import React, { useState, useEffect } from 'react';
import { IconButton, Button, TextInput, Chip } from 'react-native-paper';
import { View, StyleSheet, Text, KeyboardAvoidingView, Keyboard, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AuthenticatedLayout from '../../../Layout/User/Unauthorize/AuthenticatedLayout';
import CustomTextInput from '../../../components/CustomTextInput';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { useUser } from "../../../hooks/useUser";
import { useMutation } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance, { getJWTHeader } from '../../../../utils/axiosConfig';

async function AddSkill(dataToUpdate) {
  try {
    const user = JSON.parse(await AsyncStorage.getItem('upcare_user'));
    const headers = getJWTHeader(user);
    const { data } = await axiosInstance.put(`/user/profile/add-skills`, dataToUpdate, { headers });
    console.log('Update successful:', data);
    return data;
  } catch (error) {
    console.error('Error adding skill:', error);
    throw error;
  }
}

const AddSkillScreen = () => {
  const { user } = useUser();
  const navigation = useNavigation();
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      skill_name: user?.skill_name || ''
    }
  });

  const onSubmit = async (data) => {
    await AddSkill(data);
    // navigation.goBack();
  };

  return (
    <AuthenticatedLayout>
      <KeyboardAvoidingView style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 40 })}>
        <View style={styles.container}>
          <View style={{ top: 40 }}>
            <IconButton onPress={() => navigation.goBack()} icon="arrow-left" />
          </View>

          <View style={{ padding: 15, marginTop: 60 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#0A3480', marginBottom: 40 }}>Add Professional Skill</Text>
            <CustomTextInput
              control={control}
              theme={{ roundness: 15 }}
              name="about_me"
              style={{ borderRadius: 5 }}
            />
            <View style={styles.skillContainer}>
              {/* Display skills chips here */}
            </View>

            <Button mode="contained" onPress={handleSubmit(onSubmit)} style={{ marginTop: keyboardVisible ? 20 : 400 }}>
              Add
            </Button>
            <Button mode="outlined" style={{ marginTop: keyboardVisible ? 10 : 10 }}>
              Save
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </AuthenticatedLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AddSkillScreen;
