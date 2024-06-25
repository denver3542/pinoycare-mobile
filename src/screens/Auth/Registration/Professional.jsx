import { useState } from "react";
import Spinner from "react-native-loading-spinner-overlay";
import {
    StyleSheet,
    ToastAndroid,
    View,
} from "react-native";
import {
    Button,
    Text,
    TextInput,
    useTheme,
} from "react-native-paper";
import UnathorizeLayout from "../../../Layout/User/Unauthorize/UnathorizeLayout";
import CustomTextInput from "../../../components/CustomTextInput";
import { useForm } from "react-hook-form";
import CustomSelectBox from "../../../components/CustomSelectBox";
import { useAuth } from "../../../hooks/useAuth";
import CustomSnackbar from "../../../components/CustomSnackbar";

const Professional = () => {
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const { control, handleSubmit, watch, setError } = useForm();
    const { colors } = useTheme();
    const [showPw, setShowPw] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);

    const showSnackbar = () => {
        setSnackbarVisible(true);
    };

    const hideSnackbar = () => {
        setSnackbarVisible(false);
    };


    const onSubmit = async (data) => {
        setLoading(true)
        signup(data).then((res) => {
            if (res.success === 0) {
                setError('email', { type: 'custom', message: 'Email is already taken.' })
            } else {
                console.log('success');
                showSnackbar()
            }
        }).catch(err => {
            setError('email', { type: 'custom', message: 'Email is already taken.' })
            console.log(err);
        });
        setLoading(false)
    }
    return (
        <UnathorizeLayout>
            <Spinner visible={loading} color={colors.primary} />
            <View style={{ justifyContent: 'center', gap: 5 }}>
                <Text style={{
                    fontWeight: "bold",
                    color: colors.primary,
                    fontSize: 18,
                    marginBottom: 30,
                    textAlign: 'center'
                }}>
                    Professional Account
                </Text>
                <CustomTextInput
                    control={control}
                    name="firstname"
                    placeholder="Firstname"
                    rules={{ required: "Firstname must not be empty" }}
                />
                <CustomTextInput
                    control={control}
                    name="middlename"
                    placeholder="Middlename"
                    rules={{ required: "Middlename must not be empty" }}
                />
                <CustomTextInput
                    control={control}
                    name="lastname"
                    placeholder="Lastname"
                    rules={{ required: "Lastname must not be empty" }}
                />
                <CustomSelectBox
                    control={control}
                    name="gender"
                    items={[
                        { label: 'Select a Gender', value: '' },
                        { label: 'Male', value: 'M' },
                        { label: 'Female', value: 'F' },
                    ]}
                    rules={{ required: "Select a Gender" }}
                />
                <CustomTextInput
                    control={control}
                    name="date_of_birth"
                    placeholder="Birthdate"
                    rules={{ required: "Birthdate must not be empty" }}
                />
                <CustomTextInput
                    control={control}
                    name="email"
                    placeholder="Email"
                    rules={{ required: "Email must not be empty" }}
                />
                <CustomTextInput
                    control={control}
                    name="password"
                    placeholder="Password"
                    rules={{ required: "Password must not be empty" }}
                    secureTextEntry={!showPw}
                    right={<TextInput.Icon icon={showPw ? "eye-off" : "eye"} onPress={() => setShowPw(pw => !pw)} />}
                />
                <CustomTextInput
                    control={control}
                    name="confirmpassword"
                    placeholder="Confirm Password"
                    rules={{ required: "Password must not be empty" }}
                    secureTextEntry={!showPw}
                    right={<TextInput.Icon icon={showPw ? "eye-off" : "eye"} onPress={() => setShowPw(pw => !pw)} />}
                />
                <Button
                    style={styles.btn}
                    labelStyle={{
                        fontSize: 16, // Increase font size for larger text
                        paddingVertical: 8, // Increase padding for taller button
                    }}
                    mode="contained"
                    onPress={handleSubmit(onSubmit)}
                >
                    Submit
                </Button>
            </View>
            <CustomSnackbar
                visible={snackbarVisible}
                onDismiss={hideSnackbar}
                message="Registered Successfully"
                color="green"
            />
        </UnathorizeLayout>


    );
};

const styles = StyleSheet.create({
    btn: {
        marginTop: 20,
        borderRadius: 5,
    }
});

export default Professional;
