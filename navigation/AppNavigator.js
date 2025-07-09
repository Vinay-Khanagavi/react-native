import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import TapGameScreen from '../screens/TapGameScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import GlassTabBar from '../components/GlassTabBar';
import Colors from '../components/Colors';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={props => <GlassTabBar {...props} currentRoute={props.state.routeNames[props.state.index]} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: 'transparent', borderTopWidth: 0 },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: Colors.backgroundLight },
          headerTintColor: Colors.textPrimary,
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="TapGame" component={TapGameScreen} options={{ title: 'Tap Game' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
