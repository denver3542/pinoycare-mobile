import React, { useState, useRef, useMemo, useCallback } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Button, Appbar, Chip } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import Spinner from 'react-native-loading-spinner-overlay';
import CustomTextInput from '../../../components/CustomTextInput';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import useSkills from './Skills/hooks/useSkills';

const AddSkillScreen = () => {
  const navigation = useNavigation();
  const { control, handleSubmit, setValue, getValues, formState: { errors, isSubmitted } } = useForm({
    defaultValues: {
      skill_name: '',
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

  // Bottom Sheet
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
              error={(isSubmitted && tags.length === 0 && errors.skill_name) ? "Skill name is required" : undefined}
            />
            <View style={styles.chipContainer}>
              {tags.map((tag, index) => (
                <Chip key={`tag-${index}`} onClose={() => removeTag(index)} style={styles.chip}>
                  {tag}
                </Chip>
              ))}
            </View>
            <View style={styles.buttonContainer}>
              <Button mode="outlined" onPress={addTag} style={styles.button}>Add</Button>
              <Button
                mode="contained"
                onPress={openBottomSheet}
                style={[styles.button, { opacity: tags.length === 0 ? 0.5 : 1 }]}
                disabled={tags.length === 0}
              >
                Save
              </Button>
            </View>
          </ScrollView>
        </View>
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
    justifyContent: 'space-between',
    backgroundColor: '#F4F7FB'
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
