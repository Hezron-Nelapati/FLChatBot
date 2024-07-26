import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {CHATBOT_TAB} from '../common/routes.ts';
import ChatBot from '../screens/chatbot';

function EmptyComponent() {
  return null;
}

export default function NavigationView() {
  const Tab = createBottomTabNavigator();
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          unmountOnBlur: true,
        }}
        detachInactiveScreens={true}
        backBehavior="none"
        tabBar={EmptyComponent}>
        <Tab.Screen name={CHATBOT_TAB} component={ChatBot} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
