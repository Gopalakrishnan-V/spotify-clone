import React from 'react';
import {StyleSheet, Dimensions, View, TouchableOpacity} from 'react-native';
import Image from 'react-native-fast-image';
import {SPACE_4, SPACE_8} from '../../constants/dimens';
import Text from '../../components/Text';
import {FONT_BOLD} from '../../constants';

const IMAGE_SIZE = Dimensions.get('window').width * 0.4;

interface FeedRowItemProps {
  imageUrl: string | null;
  title: string | null;
  isFirstItem: boolean;
  onPress: () => void;
}

const FeedRowItem: React.FC<FeedRowItemProps> = ({
  imageUrl,
  title,
  isFirstItem,
  onPress,
}) => {
  const containerStyle = [styles.container, {marginLeft: isFirstItem ? 0 : 16}];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={containerStyle}>
      <View>
        <Image source={{uri: imageUrl ?? '-'}} style={styles.image} />
        <View style={styles.textWrapper}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            as="title6"
            style={styles.title}
            label={title}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {},
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: SPACE_4,
    marginBottom: SPACE_8,
  },
  textWrapper: {
    width: IMAGE_SIZE,
    flexDirection: 'row',
  },
  title: {
    fontFamily: FONT_BOLD,
  },
});

export default FeedRowItem;
