import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {CHATBOT_TAB} from '../common/routes.ts';
import ChatBot from '../screens/chatbot';

/**
 * EmptyComponent is a placeholder component that renders nothing.
 *
 * @returns {null} A null component.
 */
function EmptyComponent() {
  return null;
}

/**
 * NavigationView is the main navigation component that sets up a bottom tab navigator.
 * It includes the ChatBot screen as one of the tabs.
 *
 * @component
 * @returns {JSX.Element} The NavigationView component.
 */
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
