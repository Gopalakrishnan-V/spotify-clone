import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {COLOR_TEXT_PRIMARY, COLOR_TEXT_SECONDARY} from '../../constants/colors';
import {SPACE_16, SPACE_24, SPACE_56} from '../../constants/dimens';
import {COLOR_BORDER} from '../../constants/colors';
import textStyles from '../../constants/textStyles';

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  onBackPress: () => void;
  onClearPress: () => void;
}

const SearchBar: React.FC<SearchBarProps> = props => {
  const {query, onQueryChange, onBackPress, onClearPress} = props;

  return (
    <View style={styles.container}>
      <Icon
        name="keyboard-backspace"
        size={SPACE_24}
        color={COLOR_TEXT_SECONDARY}
        onPress={onBackPress}
      />

      <TextInput
        placeholder={'What do you want to listen to?'}
        placeholderTextColor={COLOR_TEXT_SECONDARY}
        value={query}
        autoCapitalize={'none'}
        onChangeText={onQueryChange}
        style={[textStyles.title6, styles.input]}
      />

      <Icon
        name="close"
        size={SPACE_24}
        color={COLOR_TEXT_SECONDARY}
        onPress={onClearPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: SPACE_56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACE_16,
    backgroundColor: COLOR_BORDER,
  },
  input: {
    flex: 1,
    marginStart: 16,
    marginEnd: 16,
    color: COLOR_TEXT_PRIMARY,
  },
});

export default SearchBar;
