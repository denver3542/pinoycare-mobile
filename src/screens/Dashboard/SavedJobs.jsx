
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import {
    Text,
    Searchbar,
    Divider,
    useTheme,
    Appbar,
    ActivityIndicator,
    Icon,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";


const JobApplications = ({ application }) => {
    const navigation = useNavigation();

    return (
        <TouchableWithoutFeedback onPress={() => navigation.navigate("Job", application)}>
            <View style={styles.container}>
                <View style={styles.card}>
                    <View style={styles.cardContent}>
                        <View style={styles.row}>
                            <View style={styles.applicationDetails}>
                                <Text style={styles.appliedProfession}>Developer</Text>
                                <Text style={styles.appliedCompany}>Infinity Hub</Text>
                                <Text style={styles.appliedStatus}>Processing</Text>
                            </View>
                            <Icon source="chevron-right" size={24} />
                        </View>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    card: {

    },
    cardContent: {
        flexDirection: 'row'
    },
    appliedProfession: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    appliedCompany: {
        fontSize: 14,
    },
    appliedStatus: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    row: {
        flexDirection: 'row'
    }

});
export default JobApplications;