import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'
import index from '../../../screens/User';



const BottomTab = createBottomTabNavigator();
function AuthenticatedLayout() {
    return (
        <BottomTab.Navigator initialRouteName="Home">
            <BottomTab.Screen name="Home" component={index} />
            <BottomTab.Screen name="Feeds" component={index} />
            <BottomTab.Screen name="Jobs" component={index} />
            <BottomTab.Screen name="Application" component={index} />
            <BottomTab.Screen name="Account" component={index} />
        </BottomTab.Navigator>
    )
}

export default AuthenticatedLayout