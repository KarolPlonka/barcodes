// React and React Native modules
import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  TouchableOpacity,
  Dimensions,
  View,
  Image,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

// Navigation modules
import { useIsFocused } from '@react-navigation/native';

// Third-party modules
import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist";
import Barcode from "@kichiyaki/react-native-barcode-generator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from '@expo/vector-icons';
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LinearGradient } from 'expo-linear-gradient';


// Local modules
import * as SplashScreen from 'expo-splash-screen';
import SplashScreenTest from "./splash";

const Item = React.memo(({ item, drag, onPress }) => {
  const gradiedntColors = item.logo && item.logo.colors ? item.logo.colors : ["#000000", "#888", "#000000"];

  return (
    <ScaleDecorator>
      <LinearGradient
        colors={gradiedntColors}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.linearGradient}
      >
        <TouchableOpacity onPress={onPress} onLongPress={drag} style={styles.item}>
          <View style={styles.titleWrapper}>
            
            <Text style={[styles.title, {color: gradiedntColors[0]}]}>
              {item.title}
            </Text>

            {item.logo && <Image source={item.logo.source} style={styles.logo} />}
          </View>

          <View style={styles.barcodeWrapper}>
            <Barcode
              format={item.type}
              value={item.barcode}
              text={item.barcode}
              maxWidth={Dimensions.get("window").width - 100}
              background={"white"}
              color={"white"}
            />
          </View>
        </TouchableOpacity>
      </LinearGradient>
    </ScaleDecorator>
  );
});

SplashScreen.preventAutoHideAsync()
  .then(result => console.log(`SplashScreen.preventAutoHideAsync() succeeded: ${result}`))
  .catch(console.warn);

const handleDragDrop = (data, setBARCODES) => {
  AsyncStorage.setItem("barcodes", JSON.stringify(data)).catch((e) => console.log(e));
  setBARCODES(data);
};

const ListScreen = ({ navigation }) => {
  const [BARCODES, setBARCODES] = useState([]);
  const [splashVisible, setSplashVisible] = useState(false);
  const isFocused = useIsFocused();
  const [fontsLoaded] = useFonts({
    'Actor': require('../assets/fonts/Actor-Regular.ttf'),
    'Coda-Latin': require('../assets/fonts/coda-latin-400-normal.ttf'),
    'Coda-Latin-Bold': require('../assets/fonts/coda-latin-800-normal.ttf'),
    'Coda-Latin-SemiBold': require('../assets/fonts/coda-latin-ext-400-normal.ttf'),
    'Coda-Latin-ExtraBold': require('../assets/fonts/coda-latin-ext-800-normal.ttf'),
  });

  const handleOnLayout = useCallback(async () => {
    try {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    } catch (error) {
      console.log('Error in handleOnLayout: ', error);
    }
  }, [fontsLoaded]);


  useEffect(() => {
    const loadBarcodes = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("barcodes");
        const jsonData = jsonValue !== null ? JSON.parse(jsonValue) : [];
        setBARCODES(jsonData);
      } catch (e) {
        console.log(e);
      }
    };
    if (isFocused) {
      loadBarcodes();
    }
  }, [isFocused]);


  const renderItem = ({ item, drag }) => {
    return (
      <Item
        item={item}
        drag={drag}
        onPress={() => {
          navigation.navigate("SelectedScreen", { selectedBarcode: item });
        }}
      />
    );
  };

  if (!fontsLoaded) {
    return null;
  }

  const refreshPage = () => {
    setSplashVisible(true);
    setTimeout(() => {
      navigation.navigate("ListScreen");
      setSplashVisible(false);
    }, 5000); // Adjust this time based on your splash screen animation duration
  };

  return (
    <SafeAreaView style={styles.container} onLayout={handleOnLayout}>

      {splashVisible && <SplashScreenTest /> }

      <View style={{ flex: 1, marginBottom: 10 }}>

        {/* <TouchableOpacity onPress={refreshPage} style={{ alignSelf: "center", marginVertical: 5 }}>
          <Feather name="refresh-ccw" size={24} color="black" />
        </TouchableOpacity> */}

        <GestureHandlerRootView style={{ flex: 1 }} >

          <DraggableFlatList
            data={BARCODES}
            renderItem={renderItem}
            keyExtractor={(item) => `draggable-item-${item.barcode}`}
            onDragEnd={({ data }) => handleDragDrop(data, setBARCODES)}
          />

          <LinearGradient
            colors={['#D6D9E0', 'transparent','transparent', '#D6D9E0']}
            locations={[0.001, 0.01, 0.99, 0.999]}
            style={styles.fader}
          />

        </GestureHandlerRootView>

      </View>

      <View style={styles.addButtonWrapper}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddScreen")}
        >
          <Feather name="plus" size={46} color="white" />
        </TouchableOpacity>
      </View>
      
    </SafeAreaView>
  );
};


import { StyleSheet, StatusBar } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D6D9E0",
    marginTop: StatusBar.currentHeight || 0,
    fontFamily: "Coda-Latin-Bold",
  },
  fader: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  typePicker: {
    height: 150,
    width: "80%",
    alignSelf: "center",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#1C3A77",
  },
  pressable: {
    backgroundColor: "#1C3A77",
    paddingHorizontal: 50,
    paddingVertical: 10,
    borderRadius: 20,
    margin: 10,
    borderWidth: 2,
    borderColor: "#D6D9E0",
  },
  linearGradient: {
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 18,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    fontFamily: "Actor",
    minHeight: 200,
  },
  item: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 5,
  },
  title: {
    color: "#1C3A77",
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Coda-Latin-Bold",
    flexWrap: "wrap",
    flexShrink: 1,
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FF6B6C",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  titleWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  barcodeWrapper: {
    marginBottom: 10,
  },
  addButtonWrapper: {
    position: "absolute",
    bottom: 20,
    right: 20,
    alignSelf: "flex-end",
  },
  logoWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0,
  },
  logo: {
    resizeMode: 'contain',
    height: 60,
    width: 100,
  },
});


export default ListScreen;
