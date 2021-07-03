import {StyleSheet} from 'react-native';
import {COLOR_TEXT_PRIMARY, COLOR_TEXT_SECONDARY} from './colors';
import {
  TEXT_TITLE_1_LINE_HEIGHT,
  TEXT_TITLE_1_SIZE,
  TEXT_TITLE_2_LINE_HEIGHT,
  TEXT_TITLE_2_SIZE,
  TEXT_TITLE_3_LINE_HEIGHT,
  TEXT_TITLE_3_SIZE,
  TEXT_TITLE_4_LINE_HEIGHT,
  TEXT_TITLE_4_SIZE,
  TEXT_TITLE_5_LINE_HEIGHT,
  TEXT_TITLE_5_SIZE,
  TEXT_TITLE_6_LINE_HEIGHT,
  TEXT_TITLE_6_SIZE,
  TEXT_SMALL_1_LINE_HEIGHT,
  TEXT_SMALL_1_SIZE,
  TEXT_SMALL_2_LINE_HEIGHT,
  TEXT_SMALL_2_SIZE,
  TEXT_MICRO_LINE_HEIGHT,
  TEXT_MICRO_SIZE,
} from './dimens';
import {FONT_BOLD, FONT_MEDIUM, FONT_REGULAR} from './index';

const textStyles = StyleSheet.create({
  title1: {
    fontSize: TEXT_TITLE_1_SIZE,
    lineHeight: TEXT_TITLE_1_LINE_HEIGHT,
    fontFamily: FONT_BOLD,
    color: COLOR_TEXT_PRIMARY,
  },
  title2: {
    fontSize: TEXT_TITLE_2_SIZE,
    lineHeight: TEXT_TITLE_2_LINE_HEIGHT,
    fontFamily: FONT_BOLD,
    color: COLOR_TEXT_PRIMARY,
  },
  title3: {
    fontSize: TEXT_TITLE_3_SIZE,
    lineHeight: TEXT_TITLE_3_LINE_HEIGHT,
    fontFamily: FONT_BOLD,
    color: COLOR_TEXT_PRIMARY,
  },
  title4: {
    fontSize: TEXT_TITLE_4_SIZE,
    lineHeight: TEXT_TITLE_4_LINE_HEIGHT,
    fontFamily: FONT_BOLD,
    color: COLOR_TEXT_PRIMARY,
  },
  title5: {
    fontSize: TEXT_TITLE_5_SIZE,
    lineHeight: TEXT_TITLE_5_LINE_HEIGHT,
    fontFamily: FONT_MEDIUM,
    color: COLOR_TEXT_PRIMARY,
  },
  title6: {
    fontSize: TEXT_TITLE_6_SIZE,
    lineHeight: TEXT_TITLE_6_LINE_HEIGHT,
    fontFamily: FONT_MEDIUM,
    color: COLOR_TEXT_PRIMARY,
  },
  small1: {
    fontSize: TEXT_SMALL_1_SIZE,
    lineHeight: TEXT_SMALL_1_LINE_HEIGHT,
    fontFamily: FONT_REGULAR,
    color: COLOR_TEXT_PRIMARY,
  },
  small2: {
    fontSize: TEXT_SMALL_2_SIZE,
    lineHeight: TEXT_SMALL_2_LINE_HEIGHT,
    fontFamily: FONT_REGULAR,
    color: COLOR_TEXT_SECONDARY,
  },
  micro: {
    fontSize: TEXT_MICRO_SIZE,
    lineHeight: TEXT_MICRO_LINE_HEIGHT,
    fontFamily: FONT_REGULAR,
    color: COLOR_TEXT_PRIMARY,
  },
});

export default textStyles;
