import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import { LandingPageAnimation } from './splash';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync()
  .then(result => console.log(`SplashScreen.preventAutoHideAsync() succeeded: ${result}`))
  .catch(console.warn);

const LandingScreen = ({ navigation }) => {
  const [splashVisible, setSplashVisible] = useState(false);
  const [fontsLoaded] = useFonts({
    'Actor': require('../assets/fonts/Actor-Regular.ttf'),
    'Coda-Latin': require('../assets/fonts/coda-latin-400-normal.ttf'),
    'Coda-Latin-Bold': require('../assets/fonts/coda-latin-800-normal.ttf'),
    'Coda-Latin-SemiBold': require('../assets/fonts/coda-latin-ext-400-normal.ttf'),
    'Coda-Latin-ExtraBold': require('../assets/fonts/coda-latin-ext-800-normal.ttf'),
  });

  useEffect(() => {
    const hideSplash = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        if (fontsLoaded) {
          await SplashScreen.hideAsync();
        }
      } catch (error) {
        console.log('Error in SplashScreen: ', error);
      }
    };
    hideSplash();
  }, [fontsLoaded]);
  

  const startScanning = () => {
    setSplashVisible(true);
  };

  const onAnimationFinish = () => {
    setSplashVisible(false);
    navigation.navigate('ListScreen');
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      {splashVisible && (
        <LandingPageAnimation onAnimationFinish={onAnimationFinish} />
      )}
      <Text style={styles.appTitle}>Scan Your Card</Text>
      <TouchableOpacity style={styles.startButton} onPress={startScanning}>
        <View style={styles.startButtonInner}>
          <Text style={styles.startButtonText}>Start scanning now</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(214, 217, 224)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'rgb(28, 58, 119)',
    marginBottom: 30,
    fontFamily: 'Coda-Latin-Bold',
  },
  startButton: {
    backgroundColor: '#1C3A77',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#D6D9E0',
  },
  startButtonInner: {
    alignSelf: 'center',
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Actor',
  },
});

export default LandingScreen;
