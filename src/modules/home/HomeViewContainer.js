import { compose, withState } from 'recompose';

import HomeScreen from './HomeView';

export default compose(withState('isFirstOpen', 'setAppOpened', false))(
  HomeScreen,
);
