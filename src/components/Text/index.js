import React from 'react';
import {Text as RNText} from 'react-native';
import textStyles from '../../constants/textStyles';

const Text = props => {
  const {label, as, style, children} = props;

  const textStyle = [textStyles[as] ?? null, style];
  return (
    <RNText {...props} style={textStyle}>
      {children ?? label}
    </RNText>
  );
};

export default Text;
