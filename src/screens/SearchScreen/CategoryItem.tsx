import React from 'react';
import {StyleSheet, Image, TouchableOpacity, Dimensions} from 'react-native';
import {ICategoryItem} from '../../interfaces/category';
import {getArtwork} from '../../helpers/spotifyHelpers';
import Text from '../../components/Text';

const IMAGE_SIZE = Dimensions.get('window').width * 0.175;

interface CategoryItemProps {
  data: ICategoryItem;
  backgroundColor: string;
  onPress: () => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  data,
  backgroundColor,
  onPress,
}) => {
  const styles = makeStyles(backgroundColor);
  const {name, icons} = data;
  const imageUrl = getArtwork(icons) ?? '-';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.container}>
      <Text
        label={name}
        as="title5"
        numberOfLines={2}
        ellipsizeMode="tail"
        style={styles.name}
      />
      <Image source={{uri: imageUrl}} style={styles.image} />
    </TouchableOpacity>
  );
};

const makeStyles = (backgroundColor: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      aspectRatio: 2 / 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderRadius: 8,
      overflow: 'hidden',
      backgroundColor,
    },
    name: {
      flexShrink: 1,
      marginStart: 8,
      marginTop: 8,
    },
    image: {
      width: IMAGE_SIZE,
      height: IMAGE_SIZE,
      alignSelf: 'flex-end',
      borderRadius: 8,
      transform: [{rotate: '30deg'}, {translateX: 12}],
    },
  });

export default React.memo(
  CategoryItem,
  (prevProps, nextProps) =>
    prevProps.data.id === nextProps.data.id &&
    prevProps.onPress === nextProps.onPress,
);
