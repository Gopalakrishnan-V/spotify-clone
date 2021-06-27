import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import AlbumScreen from '../AlbumScreen';
import PlaylistScreen from '../PlaylistScreen';

const HomeStack = createStackNavigator();
function HomeStackScreen() {
  return (
    <HomeStack.Navigator initialRouteName="Playlist">
      <HomeStack.Screen
        name="Album"
        component={AlbumScreen}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="Playlist"
        component={PlaylistScreen}
        options={{headerShown: false}}
      />
    </HomeStack.Navigator>
  );
}

function SearchScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>SearchScreen!</Text>
    </View>
  );
}

function LibraryScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>LibraryScreen!</Text>
    </View>
  );
}

const getTabBarIcon =
  route =>
  ({focused, color, size}) => {
    let iconName;

    if (route.name === 'HomeStack') {
      iconName = focused ? 'home-variant' : 'home-variant-outline';
    } else if (route.name === 'SearchStack') {
      iconName = 'magnify';
    } else {
      iconName = 'reorder-vertical';
    }

    return <Icon name={iconName} size={size} color={color} />;
  };

const Tab = createBottomTabNavigator();

const MainScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: getTabBarIcon(route),
      })}
      tabBarOptions={{
        activeTintColor: '#FFFFFF',
        inactiveTintColor: '#808080',
        style: {backgroundColor: '#1b1b1b'},
      }}>
      <Tab.Screen
        name="HomeStack"
        component={HomeStackScreen}
        options={{title: 'Home'}}
      />
      <Tab.Screen
        label=""
        name="SearchStack"
        component={SearchScreen}
        options={{title: 'Search'}}
      />
      <Tab.Screen
        name="Library"
        component={LibraryScreen}
        options={{title: 'My Library'}}
      />
    </Tab.Navigator>
  );
};

export default MainScreen;
