import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Text from '../../components/Text';

import {
  COLOR_BACKGROUND,
  COLOR_FADED,
  COLOR_TEXT_SECONDARY,
  COLOR_WHITE,
} from '../../constants/colors';
import {SPACE_4, SPACE_48, SPACE_8} from '../../constants/dimens';

interface StaticSearchBarProps {
  onPress: () => void;
}

const StaticSearchBar: React.FC<StaticSearchBarProps> = ({onPress}) => {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={styles.container}>
        <Icon name={'magnify'} size={32} color={COLOR_FADED} />
        <Text
          label="What do you want to listen to?"
          as="title5"
          style={styles.text}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: SPACE_4,
    backgroundColor: COLOR_BACKGROUND,
  },
  container: {
    height: SPACE_48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACE_8,
    borderRadius: 4,
    backgroundColor: COLOR_WHITE,
  },
  text: {
    marginHorizontal: SPACE_8,
    color: COLOR_TEXT_SECONDARY,
  },
});

export default StaticSearchBar;
