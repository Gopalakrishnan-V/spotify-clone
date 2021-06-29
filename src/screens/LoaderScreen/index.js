import React, {useEffect} from 'react';

import Loader from '../../components/Loader';
import {checkAndSetAccessToken} from '../../helpers/authHelpers';
import {init} from '../../helpers/playerHelpers';

const LoaderScreen = props => {
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
