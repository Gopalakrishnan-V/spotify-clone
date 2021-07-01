import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from '../HomeScreen';
import SearchScreen from '../SearchScreen';
import MyLibraryScreen from '../MyLibraryScreen';
import AlbumScreen from '../AlbumScreen';
import PlaylistScreen from '../PlaylistScreen';
import ArtistScreen from '../ArtistScreen';
import TabBarWithPlayer from '../../components/TabBarWithPlayer';

const HomeStack = createStackNavigator();
function HomeStackScreen() {
  return (
    <HomeStack.Navigator initialRouteName="Home">
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="Album"
        component={AlbumScreen}
        getId={({params}) => params.id}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="Playlist"
        component={PlaylistScreen}
        getId={({params}) => params.id}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="Artist"
        component={ArtistScreen}
        getId={({params}) => params.id}
        options={{headerShown: false}}
      />
    </HomeStack.Navigator>
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
      }}
      tabBar={props => <TabBarWithPlayer {...props} />}>
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
        component={MyLibraryScreen}
        options={{title: 'My Library'}}
      />
    </Tab.Navigator>
  );
};

export default MainScreen;
