import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import TextTicker from 'react-native-text-ticker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Text from '../../components/Text';
import {FONT_BOLD} from '../../constants';
import {COLOR_TEXT_PRIMARY, COLOR_WHITE} from '../../constants/colors';
import {
  SPACE_32,
  SPACE_24,
  SPACE_2,
  SPACE_12,
  SPACE_6,
} from '../../constants/dimens';
import textStyles from '../../constants/textStyles';

const Header = props => {
  const {albumName, onDownPress, onAlbumPress} = props;
  return (
    <View style={[styles.container, props.style]}>
      <Icon
        name="chevron-down"
        size={SPACE_32}
        color={COLOR_WHITE}
        onPress={onDownPress}
      />
      <TouchableOpacity onPress={onAlbumPress} style={styles.center}>
        <Text label={'PLAYING FROM ALBUM'} as="micro" numberOfLines={1} />
        <TextTicker
          scrollSpeed={500}
          bounce={false}
          style={[textStyles.small2, styles.title]}
          numberOfLines={1}>
          {albumName}
        </TextTicker>
      </TouchableOpacity>
      <Icon name="dots-vertical" size={SPACE_24} color={COLOR_WHITE} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: -SPACE_6,
  },
  center: {
    flex: 1,
    marginHorizontal: SPACE_12,
    alignItems: 'center',
  },
  title: {
    marginTop: SPACE_2,
    fontFamily: FONT_BOLD,
    color: COLOR_TEXT_PRIMARY,
  },
});

export default Header;
