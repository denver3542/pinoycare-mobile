import React, { useState, useRef, useCallback, useMemo } from 'react';
import { View, StyleSheet, Text, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { Appbar, Chip } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import useSkills from './Skills/hooks/useSkills';
import { useUser } from '../../../hooks/useUser';
import CustomTextInput from '../../../components/CustomTextInput';

const AddSkillScreen = () => {
  const navigation = useNavigation();
  const { mutate } = useSkills();
  const { user, deleteSkill } = useUser();
  const { control, handleSubmit, reset } = useForm();
  const [localSkills, setLocalSkills] = useState(user.skills);

  const onSubmit = async (data) => {
    const { newSkill } = data;
    if (!newSkill.trim()) return;

    closeBottomSheet();
    try {
      await mutate(newSkill, {
        onSuccess: (addedSkill) => {
          setLocalSkills((prevSkills) => [...prevSkills, addedSkill]);
          reset();
        },
      });
    } catch (error) {
      console.error('Failed to add skill:', error);
    }
  };

  const handleDeleteSkill = async (skillId) => {
    try {
      const updatedSkills = localSkills.filter(skill => skill.id !== skillId);
      setLocalSkills(updatedSkills);
      await deleteSkill(skillId);
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
    <View style={styles.flex}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color='white' />
        <Appbar.Content title="Add Skill" titleStyle={styles.whiteText} />
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
        <ScrollView style={styles.padding}>
          <Text style={styles.heading}>Added Skills</Text>
          <View style={styles.chipContainer}>
            {localSkills.map((skill, index) => (
              <Chip
                key={index}
                mode='outlined'
                style={styles.chip}
                textStyle={styles.chipText}
                onClose={() => handleDeleteSkill(skill.id)}
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
  flex: {
    flex: 1,
  },
  header: {
    backgroundColor: '#0A3480',
  },
  whiteText: {
    color: 'white',
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F4F7FB',
  },
  input: {
    height: 40,
    marginBottom: 10,
  },
  padding: {
    padding: 5,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  chip: {
    margin: 4,
    borderRadius: 50,
  },
  chipText: {
    minHeight: 15,
    lineHeight: 15,
    fontSize: 12,
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
    fontWeight: 'bold',
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
