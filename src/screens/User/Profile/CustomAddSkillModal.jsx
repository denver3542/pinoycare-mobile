import React, { useState } from 'react';
import { Text, View, Modal, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation } from 'react-query';
import axiosInstance, { getJWTHeader } from "../../../../utils/axiosConfig";

async function addSkill(id) {
  try {
    const user = await AsyncStorage.getItem('upcare_user');
    const headers = getJWTHeader(user);
    const response = await axiosInstance.post(`/user/profile/add-skills/${id}`, { skills: [addSkillData] }, { headers });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Something went wrong');
  }
}

const CustomAddSkillModal = ({ visible, onClose, onSave }) => {
  const [skill, setSkill] = useState('');

  const mutation = useMutation(addSkill);

  const handleSave = async () => {
    try {
      const data = await mutation.mutateAsync(skill);
      onSave(data);
      setSkill('');
      onClose();
    } catch (error) {
      console.error('Error adding skill:', error.message);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />

        <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '92%' }}>
          <TouchableOpacity
            style={{ position: 'absolute', top: 20, right: 20, zIndex: 1 }}
            onPress={onClose}
          >
            <FontAwesome5 name="times-circle" size={24} color="#0A347F" solid />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, marginBottom: 10 }}>Add Skill</Text>
          <TextInput
            style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 20, borderRadius: 5 }}
            placeholder="Enter skill"
            value={skill}
            onChangeText={setSkill}
          />
          <TouchableOpacity
            onPress={handleSave}
            style={{ borderRadius: 15, overflow: 'hidden' }}
          >
            <View style={{ backgroundColor: '#0A347F', paddingVertical: 10, paddingHorizontal: 20 }}>
              <Text style={{ color: '#fff', textAlign: 'center', padding: 2 }}>Save</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CustomAddSkillModal;
