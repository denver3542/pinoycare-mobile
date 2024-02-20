import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const RecentJobCard = ({ jobTitle, company, location, imageUrl, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.jobImage} />
      <View style={styles.jobDetails}>
        <Text style={styles.jobTitle}>{jobTitle}</Text>
        <Text style={styles.company}>{company}</Text>
        {/* <Text style={styles.type}>{company}</Text> */}
        <Text style={styles.location}>{location}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 15,
    marginBottom: 15,
  },
  jobImage: {
    width: '100%',
    height: 100,
    borderRadius: 14,
    marginBottom: 10,
  },
  jobDetails: {},
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  company: {
    fontSize: 16,
    color: '#555',
  },
  location: {
    fontSize: 14,
    color: '#888',
  },
});

export default RecentJobCard;
