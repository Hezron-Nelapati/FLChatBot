import React from 'react';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import {StatusBar, useColorScheme} from 'react-native';
import NavigationView from './routes';

export default function App() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <StatusBar
        animated
        showHideTransition={'slide'}
        barStyle={colorScheme === 'light' ? 'light-content' : 'dark-content'}
        backgroundColor={colorScheme === 'light' ? '#000000' : '#FFFFFFF'}
      />
      <NavigationView />
    </SafeAreaProvider>
  );
}
