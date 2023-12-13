import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'
import { FontAwesome5 } from '@expo/vector-icons';
import index from '../screens/User';



const BottomTab = createBottomTabNavigator();
function AuthenticatedNavigation() {
    return (
        <BottomTab.Navigator initialRouteName="Home"
            screenOptions={{ animationEnabled: false, headerShown: false }}
        >
            <BottomTab.Screen name="Home" component={index}
                options={{
                    tabBarLabel: '', // Hides the label
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome5 name={'home'} color={color} size={20} style={{ marginTop: 5 }} />
                    ),
                }}
            />
            <BottomTab.Screen name="Feeds" component={index}
                options={{
                    tabBarLabel: '', // Hides the label
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome5 name={'file-alt'} color={color} size={20} style={{ marginTop: 5 }} />
                    ),
                }}
            />
            <BottomTab.Screen name="Jobs" component={index}
                options={{
                    tabBarLabel: '', // Hides the label
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome5 name={'briefcase'} color={color} size={20} style={{ marginTop: 5 }} />
                    ),
                }}
            />
            <BottomTab.Screen name="Application" component={index}
                options={{
                    tabBarLabel: '', // Hides the label
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome5 name={'user-cog'} color={color} size={20} style={{ marginTop: 5 }} />
                    ),
                }}
            />
            <BottomTab.Screen name="Account" component={index}
                options={{
                    tabBarLabel: '', // Hides the label
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome5 name={'sliders-h'} color={color} size={20} style={{ marginTop: 5 }} />
                    ),
                }}
            />
        </BottomTab.Navigator>
    )
}

export default AuthenticatedNavigation