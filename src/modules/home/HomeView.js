import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ImageBackground,
  Image,
  Linking,
} from 'react-native';

import { fonts, getTheme, changeTheme } from '../../styles';
import { Text } from '../../components/StyledText';
import Onboarding from 'react-native-onboarding-swiper';
import analytics from '@react-native-firebase/analytics';
import remoteConfig from '@react-native-firebase/remote-config';

const imgBlue = require('../../../assets/images/background.png');
const imgRed = require('../../../assets/images/avatar.png');

export default class HomeScreen extends Component {
  state = {
    image: imgBlue,
    theme: getTheme(),
    isFirstTime: true,
    awesomeTitle: remoteConfig().getValue('awesome_title').value,
  };

  reload = () => {
    this.setState({
      awesomeTitle: remoteConfig().getValue('awesome_title').value,
    });
  };
  changeTheme = () => {
    const newTheme = changeTheme(this.state.theme);
    console.log('hello Theme>' + newTheme.name);
    analytics().logEvent('changingTheme', {
      prefered: newTheme.name,
    });
    analytics().setUserProperties({
      favorite_theme: newTheme.name,
    });
    const awesomeNewFeature = remoteConfig().getValue('awesome_title');
    console.log('Remote Config>' + JSON.stringify(awesomeNewFeature));
    this.setState({
      image: newTheme.name === 'red' ? imgRed : imgBlue,
      theme: newTheme,
      awesomeTitle: awesomeNewFeature.value,
    });
  };
  rnsUrl = 'https://zenika.com';
  handleClick = () => {
    Linking.canOpenURL(this.rnsUrl).then((supported) => {
      if (supported) {
        Linking.openURL(this.rnsUrl);
      } else {
        console.log(`Don't know how to open URI: ${this.rnsUrl}`);
      }
    });
  };
  onDone = () => {
    console.log('first_open');
    analytics().logEvent('onboarding_done', {
      steps: '3',
    });
    this.setState({
      isFirstTime: false,
    });
  };

  render() {
    if (this.state.isFirstTime) {
      return (
        <Onboarding
          showSkip={false}
          onDone={() => this.onDone()}
          pages={[
            {
              backgroundColor: '#fff',
              image: (
                <Image
                  source={require('../../../assets/images/pages/profile.png')}
                />
              ),
              title: 'Onboarding',
              subtitle: 'Done with React Native Onboarding Swiper',
            },
            {
              backgroundColor: '#fe6e58',
              image: (
                <Image
                  source={require('../../../assets/images/pages/calendar.png')}
                />
              ),
              title: 'The Title',
              subtitle: 'This is the subtitle that sumplements the title.',
            },
            {
              backgroundColor: '#999',
              image: (
                <Image
                  source={require('../../../assets/images/pages/chart.png')}
                />
              ),
              title: 'Triangle',
              subtitle: "Beautiful, isn't it?",
            },
          ]}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          <ImageBackground
            source={this.state.image}
            style={styles.bgImage}
            resizeMode="cover"
          >
            <View style={styles.section}>
              <Text size={20} white>
                Home
              </Text>
            </View>
            <View style={styles.section}>
              <Text color={this.state.theme.primaryGradientEnd} size={15}>
                The smartest Way to build your mobile app
              </Text>
              <Text size={30} bold white style={styles.title}>
                demo-app-react-native
              </Text>
            </View>
            <View style={[styles.section, styles.sectionLarge]}>
              <Text
                color={this.state.theme.primaryGradientEnd}
                hCenter
                size={15}
                style={styles.description}
              >
                {' '}
                {this.state.awesomeTitle}
              </Text>
              <View style={styles.priceContainer}>
                <View style={{ flexDirection: 'row' }}>
                  <Text white bold size={50} style={styles.price}>
                    Welcome!
                  </Text>
                  {/* {isExtended ? '$199.95' : '$49.95'} */}
                </View>
                <TouchableOpacity
                  style={styles.priceLink}
                  onPress={this.handleClick}
                >
                  <Text white size={14}>
                    zenika.com
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.priceLink}
                  onPress={this.changeTheme}
                >
                  <Text white size={14}>
                    Change theme
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.priceLink}
                  onPress={this.reload}
                >
                  <Text white size={14}>
                    Reload
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  bgImage: {
    flex: 1,
    marginHorizontal: -20,
  },
  section: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionLarge: {
    flex: 2,
    justifyContent: 'space-around',
  },
  sectionHeader: {
    marginBottom: 8,
  },
  priceContainer: {
    alignItems: 'center',
  },
  description: {
    padding: 15,
    lineHeight: 25,
  },
  titleDescription: {
    color: '#19e7f7',
    textAlign: 'center',
    fontFamily: fonts.primaryRegular,
    fontSize: 15,
  },
  title: {
    marginTop: 30,
  },
  price: {
    marginBottom: 5,
  },
  priceLink: {
    borderBottomWidth: 1,
    borderBottomColor: getTheme().primary,
    marginTop: 10,
  },
});
