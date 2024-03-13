import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import AuthenticatedLayout from '../../../Layout/User/Unauthorize/AuthenticatedLayout'
import CustomMultilineTextInput from '../../../components/CustomMultilineTextInput';
import { useNavigation } from '@react-navigation/native';
import { useForm } from "react-hook-form";
import { IconButton, Button } from 'react-native-paper';

const AboutMeScreen = () => {
    const [aboutMeText, setAboutMeText] = useState('');
    const { control, handleSubmit, setValue, watch, } = useForm();
    const handleSave = () => {
        console.log('Saved:', aboutMeText);
    };
    const navigation = useNavigation();
    return (
        <AuthenticatedLayout>
            <View style={styles.container}>
                <View style={{ top: 40 }}>
                    <IconButton onPress={() => navigation.goBack()} icon="arrow-left"></IconButton>
                </View>
                <View style={{ padding: 15, marginTop: 60 }}>
                    <Text style={{ fontWeight: "bold", fontSize: 20, color: "#0A3480", marginBottom: 40 }}>About Me</Text>
                    <CustomMultilineTextInput
                        control={control}
                        name="test"
                        placeholder="Tell me about yourself"
                    />
                    <Button mode="contained" onPress={() => { }} style={{ marginTop: 40 }}>
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
    },

    // button: {
    //     marginHorizontal: 15,
    //     marginVertical: 200,
    // },

});

export default AboutMeScreen;
