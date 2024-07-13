import React, { useState, useRef, useCallback, useMemo } from 'react';
import { View, StyleSheet, Text, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Appbar, Chip } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import useSkills from './Skills/hooks/useSkills';
import { useUser } from '../../../hooks/useUser';
import CustomTextInput from '../../../components/CustomTextInput';
import { ScrollView } from 'react-native-gesture-handler';

const AddSkillScreen = () => {
  const navigation = useNavigation();
  const { mutate } = useSkills();
  const { user, deleteSkill } = useUser();
  const { control, handleSubmit, reset } = useForm();
  const [localSkills, setLocalSkills] = useState(user.skills);

  const onSubmit = async (data) => {
    const { newSkill } = data;
    closeBottomSheet();
    if (!newSkill.trim()) {
      return;
    }

    try {
      const updatedSkills = [...localSkills, { skill_name: newSkill }];
      setLocalSkills(updatedSkills);
      await mutate({ skills: [newSkill] });
      reset();
    } catch (error) {
      console.error('Failed to add skill:', error);
    }
  };

  const handleDeleteSkill = async (skillsId, skillName) => {
    try {

      const updatedSkills = localSkills.filter(skill => skill.id !== skillsId);
      setLocalSkills(updatedSkills);


      await deleteSkill(skillsId);
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['25%'], []);

  const openBottomSheet = () => {
    Keyboard.dismiss();
    setTimeout(() => bottomSheetRef.current?.expand(), 50);
  };

  const closeBottomSheet = () => {
    bottomSheetRef.current?.close();
  };

  const renderBackdrop = useCallback(
    (props) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />,
    []
  );

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header style={{ backgroundColor: '#0A3480' }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color='white' />
        <Appbar.Content title="Add Skill" titleStyle={{ color: 'white' }} />
        <Appbar.Action icon="content-save" color="white" onPress={openBottomSheet} />
      </Appbar.Header>
      <View style={styles.container}>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <CustomTextInput
              control={control}
              style={styles.input}
              value={value}
              onChangeText={onChange}
              mode="outlined"
              label="Enter new skill"
              name="skill_name"
              onSubmitEditing={handleSubmit(onSubmit)}
            />
          )}
          name="newSkill"
          defaultValue=""
        />
        <ScrollView style={{ padding: 5 }}>
          <Text style={styles.heading}>Added Skills</Text>
          <View style={styles.chipContainer}>
            {localSkills.map((skill, index) => (
              <Chip
                key={index}
                mode='outlined'
                style={styles.chip}
                textStyle={{
                  minHeight: 15,
                  lineHeight: 15,
                  fontSize: 12
                }}
                onClose={() => handleDeleteSkill(skill.id, skill.skill_name)}
              >
                {skill.skill_name}
              </Chip>
            ))}
          </View>
        </ScrollView>

        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          backdropComponent={renderBackdrop}
          enablePanDownToClose={true}
        >
          <BottomSheetView style={styles.bottomSheetContent}>
            <Text style={styles.bottomSheetTitle}>Confirm Save</Text>
            <Text>Are you sure you want to save these skills?</Text>
            <View style={styles.buttonModalContainer}>
              <TouchableWithoutFeedback onPress={handleSubmit(onSubmit)}>
                <View style={[styles.buttonStyle, styles.yesButton]}>
                  <Text style={styles.buttonText}>Save Changes</Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={closeBottomSheet}>
                <View style={[styles.buttonStyle, styles.cancelButton]}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </BottomSheetView>
        </BottomSheet>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F4F7FB'
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 4,
    borderRadius: 50
  },
  input: {
    height: 40,
    marginBottom: 10,
  },
  buttonModalContainer: {
    marginTop: 10,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  yesButton: {
    backgroundColor: '#0A3480',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0A3480',
  },
  cancelButtonText: {
    color: '#0A3480',
    fontWeight: 'bold'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonStyle: {
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    paddingVertical: 10,
  },
  bottomSheetContent: {
    padding: 20,
    flex: 1,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default AddSkillScreen;
