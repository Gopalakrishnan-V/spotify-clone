import React from 'react';
import {Text as RNText, TextProps as RNTextProps} from 'react-native';
import textStyles from '../../constants/textStyles';

interface TextProps extends RNTextProps {
  label?: string | null;
  as?:
    | 'title1'
    | 'title2'
    | 'title3'
    | 'title4'
    | 'title5'
    | 'title6'
    | 'small1'
    | 'small2'
    | 'micro';
}

const Text: React.FC<TextProps> = props => {
  const {label, as = 'small1', style, children} = props;

  const textStyle = [textStyles[as] ?? null, style];
  return (
    <RNText {...props} style={textStyle}>
      {children ?? label}
    </RNText>
  );
};

export default Text;
