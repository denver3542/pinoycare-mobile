import React, { useState } from 'react';
import { Text, View, Modal, TextInput, Button, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const CustomAddSkillModal = ({ visible, onClose, onSave }) => {
  const [skill, setSkill] = useState('');

  const handleSave = () => {
    onSave(skill);
    setSkill('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        {/* Back icon */}
        <TouchableOpacity style={{ position: 'absolute', top: 20, left: 20 }} onPress={onClose}>
          <FontAwesome5 name="arrow-left" size={24} color="black" />
        </TouchableOpacity>

        <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '100%' }}>
          <Text style={{ fontSize: 20, marginBottom: 10 }}>Add Skill</Text>
          <TextInput
            style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 }}
            placeholder="Enter skill"
            value={skill}
            onChangeText={setSkill}
          />
          <Button title="Save" onPress={handleSave} />
          <Button title="Cancel" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

export default CustomAddSkillModal;
