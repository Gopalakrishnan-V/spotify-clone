import EncryptedStorage from 'react-native-encrypted-storage';

export const ACCESS_TOKEN = 'ACCESS_TOKEN';

export const setItem = async (key, value) => {
  try {
    await EncryptedStorage.setItem(key, value);
  } catch (error) {}
};

export const getItem = async key => {
  try {
    return await EncryptedStorage.getItem(key);
  } catch (error) {
    return null;
  }
};
