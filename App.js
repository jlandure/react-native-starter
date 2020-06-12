import { Provider } from 'react-redux';
import 'react-native-gesture-handler';
import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationContainer } from '@react-navigation/native';
import { colors } from './src/styles';

import { store, persistor } from './src/redux/store';
import firebase from '@react-native-firebase/app';
import analytics from '@react-native-firebase/analytics';
import remoteConfig from '@react-native-firebase/remote-config';

import AppView from './src/modules/AppViewContainer';

analytics().logAppOpen();
// Gets the current screen from navigation state
const getActiveRouteName = (state) => {
  const route = state.routes[state.index];

  if (route && route.state) {
    // Dive into nested navigators
    return getActiveRouteName(route.state);
  }

  return route.name;
};
export default function App() {
  const routeNameRef = React.useRef();
  const navigationRef = React.useRef();
  const state = { routes: [] };
  React.useEffect(() => {
    //const state = navigationRef.current.getRootState();
    //console.log('state=>' + JSON.stringify(state));
    // Save the initial route name
    routeNameRef.current = 'Home'; //getActiveRouteName(state);
    remoteConfig().setConfigSettings({
      isDeveloperModeEnabled: true,
    });
    remoteConfig()
      .setDefaults({
        awesome_title: 'Default Value for my Firebase Demo',
      })
      .then(() => remoteConfig().activate())
      .then(() => remoteConfig().fetch())
      .then((activated) => {
        if (activated) {
          console.log('Defaults set, fetched & activated!');
        } else {
          console.log('Defaults set, however activation failed.');
        }
      });
  }, []);
  return (
    <Provider store={store}>
      {/* {firebase.apps.length && <Text style={styles.module}>app()</Text>}
      {analytics().native && <Text style={styles.module}>analytics()</Text>} */}
      <NavigationContainer
        ref={navigationRef}
        onStateChange={(state) => {
          // LOG info on the current screen
          // console.log('screen_view' + JSON.stringify(state));
          const previousRouteName = routeNameRef.current;
          const currentRouteName = getActiveRouteName(state);

          if (previousRouteName !== currentRouteName) {
            analytics().setCurrentScreen(currentRouteName, currentRouteName);
          }
        }}
      >
        <PersistGate
          loading={
            // eslint-disable-next-line react/jsx-wrap-multilines
            <View style={styles.container}>
              <ActivityIndicator color={colors.red} />
            </View>
          }
          persistor={persistor}
        >
          <AppView />
        </PersistGate>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});
