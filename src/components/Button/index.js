import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

export default function Button(props) {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      activeOpacity={0.9}
      style={[styles.container, props.style]}>
      <Text style={[styles.text, props.textStyle]}>{props.text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
    backgroundColor: '#1DB954',
  },
  text: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
