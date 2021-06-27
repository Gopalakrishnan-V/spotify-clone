import React from 'react';
import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import LoaderScreen from './src/screens/LoaderScreen';
import MainScreen from './src/screens/MainScreen';
import PlayerScreen from './src/screens/PlayerScreen';
import {navigationRef} from './RootNavigation';

const myTheme = {
  ...DarkTheme,
  colors: {
    primary: '#1DB954',
    text: '#FFFFFF',
    ...DarkTheme.colors,
  },
};

const Stack = createStackNavigator();

const Navigator = () => {
  return (
    <NavigationContainer ref={navigationRef} theme={myTheme}>
      <Stack.Navigator initialRouteName="Loader" mode="modal">
        <Stack.Screen
          name="Loader"
          component={LoaderScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Main"
          component={MainScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Player"
          component={PlayerScreen}
          options={{headerShown: false, gestureDirection: 'vertical'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
