import React, {useEffect} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';

import {RootStackParamList} from '../../../Navigator';
import Loader from '../../components/Loader';
import {checkAndSetAccessToken} from '../../helpers/authHelpers';
import {init} from '../../helpers/playerHelpers';

interface LoaderScreenProps {
  navigation: StackNavigationProp<RootStackParamList>;
}

const LoaderScreen: React.FC<LoaderScreenProps> = props => {
  const {navigation} = props;

  useEffect(() => {
    (async () => {
      try {
        await init();
        const {error} = await checkAndSetAccessToken();
        if (error) {
          return;
        }

        navigation.replace('Main');
      } catch (e) {}
    })();
  }, [navigation]);

  return <Loader />;
};

export default LoaderScreen;
