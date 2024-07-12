import React, { useState, useRef, useMemo, useCallback } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Button, Appbar, Chip } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import Spinner from 'react-native-loading-spinner-overlay';
import CustomTextInput from '../../../components/CustomTextInput';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import useSkills from './Skills/hooks/useSkills';
import { useUser } from '../../../hooks/useUser';

const AddSkillScreen = () => {
  const navigation = useNavigation();
  const { user, deleteSkill } = useUser();
  const { control, handleSubmit, setValue, getValues, formState: { errors, isSubmitted } } = useForm({
    defaultValues: {
      skill_name: '',
    },
  });
  const { mutate, isLoading } = useSkills();
  const [tags, setTags] = useState([]);

  const addTag = () => {
    const skillName = getValues('skill_name');
    if (!skillName) return;

    setTags([...tags, skillName]);
    setValue('skill_name', '');
  };

  const removeTag = (indexToRemove) => {
    const updatedTags = tags.filter((_, index) => index !== indexToRemove);
    setTags(updatedTags);
  };

  const onSubmit = async () => {
    if (tags.length === 0) return;

    await mutate({ skills: tags });
    setTags([]);
  };

  const deleteSkillHandler = async (skillsId) => {
    try {
      console.log('Deleting skill with ID:', skillsId);
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>
        <Appbar.Header style={{ backgroundColor: '#0A3480' }}>
          <Appbar.BackAction onPress={() => navigation.goBack()} color='white' />
          <Appbar.Content title="Add Skill" titleStyle={{ color: 'white' }} />
        </Appbar.Header>
        <ScrollView style={styles.container}>

          <CustomTextInput
            placeholder="Add Skill"
            control={control}
            label="Skill Name"
            mode="outlined"
            name="skill_name"
            onSubmitEditing={addTag}
          />
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}> Added Skills</Text>
          <View style={styles.chipContainer}>
            {[...user.skills, ...tags].map((item, index) => (
              <Chip
                mode='outlined'
                key={index}
                style={styles.chip}
                onClose={() => {
                  const isUserSkill = index < user.skills.length;
                  const adjustedIndex = isUserSkill ? index : index - user.skills.length;
                  removeTag(adjustedIndex);
                  if (isUserSkill) {
                    deleteSkillHandler(item.skill_id);
                  }
                }}
              >
                {item.skill_name || item}
              </Chip>
            ))}
          </View>

          <View style={styles.buttonContainer}>
            <Button mode="outlined" style={styles.button} onPress={addTag}>
              Add
            </Button>
            <Button
              mode="contained"
              onPress={openBottomSheet}
              style={[styles.button]}
            >
              Save
            </Button>
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
        <Spinner visible={isLoading} />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    // justifyContent: 'space-between',
    backgroundColor: '#F4F7FB'
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 20,
  },
  chip: {
    margin: 4,
    borderRadius: 50
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
    marginTop: 10,
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
