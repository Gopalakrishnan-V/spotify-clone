import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Text from '../../components/Text';
import {COLOR_FADED} from '../../constants/colors';
import {SPACE_16, SPACE_24} from '../../constants/dimens';

interface MenuItemProps {
  icon: string;
  label: string;
}

const MenuItem: React.FC<MenuItemProps> = ({icon, label}) => {
  return (
    <TouchableOpacity style={styles.container}>
      <Icon
        name={icon}
        size={SPACE_24}
        color={COLOR_FADED}
        style={styles.icon}
      />
      <Text label={label} as="title5" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACE_16,
  },
  icon: {
    marginRight: SPACE_24,
  },
});

export default MenuItem;
