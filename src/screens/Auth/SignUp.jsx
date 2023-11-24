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
import { Header } from "../../Layout/User/Unauthorize";
import UnathorizeLayout from "../../Layout/User/Unauthorize/UnathorizeLayout";

const SignUp = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const navRegistration = async (route) => {
    navigation.navigate(route);
  };

  return (
    <UnathorizeLayout>
      <Spinner visible={loading} color={colors.primary} />
      <View style={{ paddingVertical: 20, marginBottom: 20, alignItems: 'center' }}>
        <Text style={{
          fontWeight: "bold",
          color: colors.primary,
          fontSize: 24,
          marginBottom: 20,
        }}>
          Select your Role
        </Text>
        <TouchableOpacity onPress={() => navRegistration('Professional')} style={styles.card}>
          <Text style={styles.header}>Medical Professional</Text>
          <Text style={styles.body}>I'm a medical professional and I'm currently interested in looking for a job.</Text>
        </TouchableOpacity>
        <View style={styles.lineContainer}>
          <View style={styles.line} />
          <View>
            <Text style={styles.lineText}>For Employers</Text>
          </View>
          <View style={styles.line} />
        </View>
        <TouchableOpacity onPress={() => navRegistration('IndividualEmployer')} style={styles.card}>
          <Text style={styles.header}>Individual Employer</Text>
          <Text style={styles.body}>I'm a Individual employer and I'm currently interested in looking for a professional.</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navRegistration('OrganizationEmployer')} style={styles.card}>
          <Text style={styles.header}>Organization Employer</Text>
          <Text style={styles.body}>I'm a Organization employer and I'm currently interested in looking for a professional.</Text>
        </TouchableOpacity>
      </View>
    </UnathorizeLayout>
  );
};

const styles = StyleSheet.create({

  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    marginVertical: 8,
    padding: 30,
  },
  header: {
    color: '#012970',
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 4, // Adjust the space between the header and the body as needed
  },
  body: {
    fontSize: 14,
    letterSpacing: 0.5,
    lineHeight: 20,
  },
  lineContainer: {
    flexDirection: 'row', // Align children in a row
    alignItems: 'center', // Center items vertically
    marginVertical: 20, // Add vertical spacing
  },
  line: {
    flex: 1, // Take up all available space
    height: 1, // 1 pixel high line
    backgroundColor: 'grey', // Line color
  },
  lineText: {
    width: '100%', // Width of the 'or' container
    textAlign: 'center', // Center text horizontally
    color: 'grey', // Text color
    paddingHorizontal: 10, // Horizontal padding
  },
});

export default SignUp;
