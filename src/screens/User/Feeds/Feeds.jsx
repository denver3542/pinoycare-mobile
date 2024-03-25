import React from 'react';
import { View, StyleSheet, FlatList, Text, Image } from 'react-native';
import { Appbar } from "react-native-paper";
import FeedsCard from './hooks/FeedsCard';
import useFeeds from './hooks/useFeeds';
function Feeds({ navigation }) {
    const { data: feeds, user } = useFeeds();

    return (
        <View style={{ flex: 1 }}>
            <Appbar.Header>
                <Appbar.Content
                    title="Feeds"
                    titleStyle={styles.title}
                />
                <Appbar.Action
                    icon={({ color, size }) => (
                        <Image
                            source={
                                user && user.media[0]
                                    ? { uri: user.media[0].original_url }
                                    : require("../../../../assets/images/sample-profile.jpg")
                            }
                            style={{ width: size, height: size, borderRadius: 50 }}
                        />
                    )}
                    onPress={() => navigation.navigate("SettingsScreen")}
                />
            </Appbar.Header>
            {/* <Text style={styles.header}>Welcome to UPCare</Text> */}
            <FlatList
                data={feeds}
                renderItem={({ item }) => <FeedsCard feed={item} />}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8
    },
    title: {
        color: '#0A3480',
        fontWeight: 'bold'
    },
    listContainer: { padding: 8 },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0A3480',
        alignSelf: 'center',
        marginTop: 10
    }
});

export default Feeds;
