import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import AlbumScreen from './src/screens/AlbumScreen';
import PlayerScreen from './src/screens/PlayerScreen';

const myTheme = {
  ...DarkTheme,
  colors: {
    primary: '#1DB954',
    text: "#FFFFFF",
    ...DarkTheme.colors,
  }
};

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer theme={myTheme}>
      <Stack.Navigator initialRouteName="Album">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Album" component={AlbumScreen} />
        <Stack.Screen name="Player" component={PlayerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}



export default App;