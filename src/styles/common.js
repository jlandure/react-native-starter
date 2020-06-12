import { StyleSheet, StatusBar, Platform } from 'react-native';

import { blueVersion } from './colors';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: blueVersion.white,
    paddingTop: Platform.select({ ios: 0, android: StatusBar.currentHeight }),
  },
});
