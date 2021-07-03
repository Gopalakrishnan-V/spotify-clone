import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import Text from '../Text';
import {COLOR_BLACK, COLOR_PRIMARY} from '../../constants/colors';
import {SPACE_24, SPACE_32, SPACE_48} from '../../constants/dimens';
import {FONT_BOLD} from '../../constants';

interface ButtonProps {
  text: string;
  onPress: () => void;
  style?: any;
  textStyle?: any;
}

const Button: React.FC<ButtonProps> = props => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      activeOpacity={0.9}
      style={[styles.container, props.style]}>
      <Text
        label={props.text}
        as="title5"
        style={[styles.text, props.textStyle]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACE_32,
    height: SPACE_48,
    borderRadius: SPACE_24,
    backgroundColor: COLOR_PRIMARY,
  },
  text: {
    fontFamily: FONT_BOLD,
    color: COLOR_BLACK,
  },
});

export default Button;
