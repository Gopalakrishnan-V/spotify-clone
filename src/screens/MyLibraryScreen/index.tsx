import React from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Text from '../../components/Text';
import {COLOR_BLACK, COLOR_PRIMARY, COLOR_WHITE} from '../../constants/colors';
import {SPACE_16, SPACE_24, SPACE_32} from '../../constants/dimens';
import MenuItem from './MenuItem';

const MENU_ITEMS = [
  {icon: 'music', label: 'Playlists'},
  {icon: 'access-point', label: 'Stations'},
  {icon: 'music-note-eighth', label: 'Songs'},
  {icon: 'album', label: 'Albums'},
  {icon: 'account-music-outline', label: 'Artists'},
  {icon: 'access-point', label: 'Podcasts & Videos'},
];

const LibraryScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, {top: insets.top}]}>
      <View style={styles.topBar}>
        <View style={styles.leftIconBg}>
          <Text label="Z" as="title6" style={styles.leftIconText} />
        </View>
        <Text label="Your Library" as="title3" style={styles.titleText} />

        <Icon
          name={'magnify'}
          size={SPACE_24}
          color={COLOR_WHITE}
          style={styles.searchIcon}
        />

        <Icon name={'plus'} size={SPACE_24} color={COLOR_WHITE} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View>
          {MENU_ITEMS.map((item, index) => {
            const {icon, label} = item;
            return <MenuItem key={String(index)} icon={icon} label={label} />;
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: SPACE_16,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACE_16,
  },
  leftIconBg: {
    width: SPACE_32,
    height: SPACE_32,
    borderRadius: SPACE_32 / 2,
    backgroundColor: COLOR_PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACE_16,
  },
  leftIconText: {
    color: COLOR_BLACK,
  },
  titleText: {
    flex: 1,
  },
  scrollView: {
    marginTop: SPACE_16,
  },
  searchIcon: {
    marginRight: SPACE_24,
  },
});

export default LibraryScreen;
