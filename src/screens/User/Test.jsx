import React from "react";
import { View, ScrollView } from "react-native";
import {
  Appbar,
  Card,
  Title,
  Paragraph,
  Button,
  Text,
  Avatar,
} from "react-native-paper";

const Test = () => {
  return (
    <ScrollView>
      <Appbar.Header>
        <Appbar.Content title="Hello Orlando Diggs." />
        <Appbar.Action icon="account" onPress={() => {}} />
      </Appbar.Header>

      <View style={{ padding: 10 }}>
        <Card style={{ marginBottom: 10 }}>
          <Card.Content>
            <Title>50% off take any courses</Title>
            <Button mode="contained" onPress={() => {}}>
              Join Now
            </Button>
          </Card.Content>
        </Card>

        <Title>Find Your Job</Title>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Card style={{ width: "48%", marginBottom: 10 }}>
            <Card.Content>
              <Avatar.Icon size={48} icon="briefcase" />
              <Paragraph>44.5k Remote Job</Paragraph>
            </Card.Content>
          </Card>
          <Card style={{ width: "48%", marginBottom: 10 }}>
            <Card.Content>
              <Avatar.Icon size={48} icon="clock-outline" />
              <Paragraph>66.8k Full Time</Paragraph>
            </Card.Content>
          </Card>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Card style={{ width: "48%", marginBottom: 10 }}>
            <Card.Content>
              <Avatar.Icon size={48} icon="clock-outline" />
              <Paragraph>38.9k Part Time</Paragraph>
            </Card.Content>
          </Card>
          {/* Placeholder for additional card or element */}
          <View style={{ width: "48%" }} />
        </View>

        <Title>Recent Job List</Title>
        <Card>
          <Card.Content>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Avatar.Icon size={48} icon="folder-outline" />
              <View>
                <Text>Product Designer</Text>
                <Text>Google Inc. - California, USA</Text>
                <Text>$15K/Mo - Senior Designer</Text>
              </View>
              <Button mode="outlined" onPress={() => {}}>
                Apply
              </Button>
            </View>
          </Card.Content>
        </Card>
        {/* More job cards can be added here */}
      </View>
    </ScrollView>
  );
};

export default Test;
