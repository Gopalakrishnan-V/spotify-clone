import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';

import {SPACE_32, SPACE_8} from '../../constants/dimens';
import Text from '../../components/Text';
import {COLOR_TEXT_SECONDARY} from '../../constants/colors';

const HEIGHT = Dimensions.get('screen').height * 0.7;

interface EmptyStateProps {
  title: string;
  subTitle: string;
}

const EmptyState: React.FC<EmptyStateProps> = props => {
  const {title, subTitle} = props;

  return (
    <View style={styles.container}>
      <Text label={title} as="title4" style={styles.title} />
      <Text label={subTitle} as="small1" style={styles.subTitle} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACE_32,
  },
  title: {
    textAlign: 'center',
  },
  subTitle: {
    marginTop: SPACE_8,
    textAlign: 'center',
    color: COLOR_TEXT_SECONDARY,
  },
});

export default EmptyState;
