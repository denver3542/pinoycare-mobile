import React from 'react';
import { View, StyleSheet, FlatList, Text, Image } from 'react-native';
import { Appbar } from "react-native-paper";
import FeedsCard from './hooks/FeedsCard';
import useFeeds from './hooks/useFeeds';
function Feeds({ navigation }) {
    const { data: feeds } = useFeeds();

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.Content
                    title="Feeds"
                    titleStyle={styles.title}
                />
            </Appbar.Header>
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
        flex: 1
    },
    title: {
        color: '#0A3480',
        fontWeight: 'bold'
    },
    listContainer: { marginTop: 10 },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0A3480',
        alignSelf: 'center',
    }
});

export default Feeds;
