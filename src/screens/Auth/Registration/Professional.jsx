import { useState, useEffect } from "react";
import Spinner from "react-native-loading-spinner-overlay";
import {
    StyleSheet,
    View,
    SafeAreaView,
    ScrollView,
} from "react-native";
import {
    Button,
    Text,
    useTheme,
} from "react-native-paper";
import { TouchableOpacity } from "react-native";
import { Header } from "../../../Layout/User/Unauthorize";
import UnathorizeLayout from "../../../Layout/User/Unauthorize/UnathorizeLayout";
import CustomTextInput from "../../../components/CustomTextInput";
import { useForm } from "react-hook-form";
import CustomSelectBox from "../../../components/CustomSelectBox";

const Professional = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const { control, handleSubmit, setError, setValue } = useForm();
    const { colors } = useTheme();

    useEffect(() => {
        setLoading(true);

        const timer = setTimeout(() => {
            setLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    return (
        <UnathorizeLayout>
            <Spinner visible={loading} color={colors.primary} />
            <View style={{ paddingVertical: 20, marginBottom: 20, justifyContent: 'center', gap: 5 }}>
                <Text style={{
                    fontWeight: "bold",
                    color: colors.primary,
                    fontSize: 24,
                    marginBottom: 20,
                    textAlign: 'center'
                }}>
                    Create an Account
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
                    name="yourFieldName"
                    items={[
                        { label: 'Male', value: 'option1' },
                        { label: 'Female', value: 'option2' },
                    ]}
                />
                <CustomTextInput
                    control={control}
                    name="date"
                    placeholder="Date"
                    rules={{ required: "Email must not be empty" }}
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
                    rules={{ required: "Email must not be empty" }}
                />
                <CustomTextInput
                    control={control}
                    name="confirmpassword"
                    placeholder="Confirm Password"
                    rules={{ required: "Email must not be empty" }}
                />
            </View>
        </UnathorizeLayout>


    );
};

const styles = StyleSheet.create({

});

export default Professional;
