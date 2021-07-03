import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {RouteProp} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from '../HomeScreen';
import SearchScreen from '../SearchScreen';
import MyLibraryScreen from '../MyLibraryScreen';
import AlbumScreen from '../AlbumScreen';
import PlaylistScreen from '../PlaylistScreen';
import ArtistScreen from '../ArtistScreen';
import TabBarWithPlayer from '../../components/TabBarWithPlayer';
import {
  COLOR_BOTTOM_BAR,
  COLOR_TEXT_PRIMARY,
  COLOR_TEXT_SECONDARY,
} from '../../constants/colors';

export type HomeStackParamList = {
  Home: undefined;
  Album: {id: string};
  Playlist: {id: string};
  Artist: {id: string};
};

const HomeStack = createStackNavigator<HomeStackParamList>();
const HomeStackScreen = () => {
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
};

type TabParamList = {
  HomeStack: undefined;
  SearchStack: undefined;
  Library: undefined;
};

const getTabBarIcon =
  (route: RouteProp<TabParamList, keyof TabParamList>) =>
  (props: {focused: boolean; color: string; size: number}) => {
    const {focused, color, size} = props;
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

const Tab = createBottomTabNavigator<TabParamList>();

const MainScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: getTabBarIcon(route),
      })}
      tabBarOptions={{
        activeTintColor: COLOR_TEXT_PRIMARY,
        inactiveTintColor: COLOR_TEXT_SECONDARY,
        style: {backgroundColor: COLOR_BOTTOM_BAR},
      }}
      tabBar={props => <TabBarWithPlayer {...props} />}>
      <Tab.Screen
        name="HomeStack"
        component={HomeStackScreen}
        options={{title: 'Home'}}
      />
      <Tab.Screen
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
