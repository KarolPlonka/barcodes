// Import React and React Native components
import React, { useEffect, useReducer, useCallback } from "react";
import {
  Text,
  View,
  Button,
  Pressable,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import Checkbox from 'expo-checkbox';
import { StyleSheet } from "react-native";

// Import Expo BarCodeScanner and react-navigation hook
import { BarCodeScanner } from "expo-barcode-scanner";
import { useNavigation } from "@react-navigation/native";

import LogoPicker from "../components/logoPicker";

// Import custom components and functions
import SplashScreen from "./splash";
import { Picker } from '@react-native-picker/picker';

import { barcodeTypes, findBarcodeTypeIndex } from "../utils/barcodesHandler";
import { appendData, checkBarcode } from "../utils/utils";
import { reducer, initialState } from "../utils/reducer";
import { useFonts } from "expo-font";

export default function AddScreen() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    'Actor': require('../assets/fonts/Actor-Regular.ttf'),
    'Coda-Latin': require('../assets/fonts/coda-latin-400-normal.ttf'),
    'Coda-Latin-Bold': require('../assets/fonts/coda-latin-800-normal.ttf'),
    'Coda-Latin-SemiBold': require('../assets/fonts/coda-latin-ext-400-normal.ttf'),
    'Coda-Latin-ExtraBold': require('../assets/fonts/coda-latin-ext-800-normal.ttf'),
  });



  const handleOnLayout = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      dispatch({ type: "SET_HAS_PERMISSION", payload: status === "granted" });
    })();
  };

  useEffect(() => {
    if (state.isBarcodeValid == null) {
      dispatch({ type: "SET_BORDER_COLOR", payload: "#CCCCCC" });
    } else if (state.isBarcodeValid) {
      dispatch({ type: "SET_BORDER_COLOR", payload: "#00FF00" });
    } else {
      dispatch({ type: "SET_BORDER_COLOR", payload: "#FF0000" });
    }
  }, [state.isBarcodeValid]);



  useEffect(() => {
    askForCameraPermission();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    dispatch({ type: "SET_SCANNED", payload: true });
    dispatch({ type: "SET_BARCODE_VALUE", payload: data });

    console.log("Type: " + type + "\t Barcode: " + data);

    handleBarcodeInput(data);
  };

  async function addBarcode(name, barcodeValue, barcodeTypeIndex, logo) {
    if (!name || !barcodeValue) {
      Alert.alert("Błąd", "Wypełnij wszystkie pola");
      return;
    }
    const barcodeExists = await checkBarcode(barcodeValue);
    if (barcodeExists) {
      return;
    }
    dispatch({ type: "SET_SPLASH_VISIBLE", payload: true });

    setTimeout(async () => {
      await appendData({
        title: name,
        barcode: barcodeValue,
        type: barcodeTypes[barcodeTypeIndex].name,
        logo: logo,
      });
      navigation.navigate("ListScreen", { newBarcode: barcodeValue });
      dispatch({ type: "SET_SPLASH_VISIBLE", payload: false });
    }, 5000);
  }



  if (state.hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Requesting for camera permission</Text>
      </View>
    );
  }

  if (state.hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No access to camera</Text>
        <Button
          title={"Allow Camera"}
          onPress={() => askForCameraPermission()}
        />
      </View>
    );
  }


  const handleTypeInput = (selectedIndex) => {
    dispatch({ type: "SET_BARCODE_TYPE_INDEX", payload: selectedIndex });

    if (state.barcodeValue === "") {
      dispatch({ type: "SET_IS_BARCODE_VALID", payload: null });
      return;
    }

    if (barcodeTypes[selectedIndex].isValid(state.barcodeValue)) {
      dispatch({ type: "SET_IS_BARCODE_VALID", payload: true });
      return;
    }

    dispatch({ type: "SET_IS_BARCODE_VALID", payload: false });
  };


  const handleBarcodeInput = (newBarcodeValue) => {
    dispatch({ type: "SET_BARCODE_VALUE", payload: newBarcodeValue });

    if (newBarcodeValue === "") {
      dispatch({ type: "SET_IS_BARCODE_VALID", payload: null });
      return;
    }

    console.log("New barcode value: " + newBarcodeValue);

    if(state.autoType){
      const typeIndex = findBarcodeTypeIndex(newBarcodeValue);
      if (typeIndex === null) {
        dispatch({ type: "SET_IS_BARCODE_VALID", payload: false });
        return;
      }

      dispatch({ type: "SET_BARCODE_TYPE_INDEX", payload: typeIndex });
    }
    else{
      if (!barcodeTypes[state.barcodeTypeIndex].isValid(newBarcodeValue)) {
        dispatch({ type: "SET_IS_BARCODE_VALID", payload: false });
        return;
      }
    }

    dispatch({ type: "SET_IS_BARCODE_VALID", payload: true });
  };


  const handleLogoPress = (logo) => {
    dispatch({ type: "SET_IS_LOGO_PICKER_VISBLE", payload: false });
    dispatch({ type: "SET_LOGO", payload: logo });
  }


  const handleNoLogoPress = () => {
    dispatch({ type: "SET_IS_LOGO_PICKER_VISBLE", payload: false });
    dispatch({ type: "SET_LOGO", payload: null });
  }

  return (
    <View style={styles.container} onLayout={handleOnLayout}>

      <View style={[styles.barcodebox, { borderColor: state.borderColor }]}>
        <BarCodeScanner
          onBarCodeScanned={state.scanned ? undefined : handleBarCodeScanned}
          style={{ height: 400, width: 400 }}
        />

        {state.scanned && <View style={styles.barcodeBoxOverlay}>
          <TouchableOpacity
            style={styles.buttonScanAgain}
            onPress={() => {
              dispatch({ type: "SET_SCANNED", payload: false });
              dispatch({ type: "SET_BORDER_COLOR", payload: "#CCCCCC" });
              dispatch({ type: "SET_BARCODE_VALUE", payload: "" });
              dispatch({ type: "SET_BARCODE_TYPE_INDEX", payload: 0 });
              dispatch({ type: "SET_IS_BARCODE_VALID", payload: null });
            }}
          >
            <Text style={styles.text}>Kliknij, aby zeskanować ponownie</Text>
          </TouchableOpacity>
        </View>}
      
      </View>

      <View style={styles.typePickerWrapper}>
        <Text style={styles.legend}>type</Text>
        <Picker
          style={styles.typePicker}
          selectedValue={state.barcodeTypeIndex}
          onValueChange={handleTypeInput}
          mode='dropdown'
        >
          {barcodeTypes.map((type, index) => {
            return <Picker.Item key={index} label={type.name} value={index} />
          })}
        </Picker>

        <View style={styles.checkboxWrapper}>
          <Checkbox
            style={styles.checkbox}
            color={"#1C3A77"}
            value={state.autoType}
            onValueChange={() => {
              dispatch({ type: "SET_AUTO_TYPE", payload: !state.autoType });
              dispatch({ type: "SET_IS_BARCODE_VALID", payload: null });
            }}
          />
          <Text>Auto</Text>
        </View>
      </View>

      <View style={styles.logoRow}>
        {state.logo && <Image source={state.logo.source} style={styles.logo} />}

        <TouchableOpacity
          style={styles.buttonLogo}
          onPress={() => {
            dispatch({ type: "SET_IS_LOGO_PICKER_VISBLE", payload: true });
          }}
        >
          <Text style={styles.text} >Select Logo</Text>
        </TouchableOpacity>
      </View>

      <LogoPicker
        visible={state.isLogoPickerVisible}
        onLogoPress={handleLogoPress}
        onNoLogoPress={handleNoLogoPress}
        backAction={() => {
          dispatch({ type: "SET_IS_LOGO_PICKER_VISBLE", payload: false });
        }}
      />

      <TextInput
        style={[styles.input, { borderColor: state.borderColor }]}
        value={state.barcodeValue}
        onChangeText={handleBarcodeInput}
        placeholder="barcode"
        placeholderTextColor="#9E9E9E"
      />

      <TextInput
        style={[styles.input, { borderColor: "#CCCCCC" }]}
        value={state.name}
        onChangeText={(name) => dispatch({ type: "SET_NAME", payload: name })}
        placeholder="name"
        placeholderTextColor="#9E9E9E"
      />

      <Pressable
        style={styles.pressable}
        onPress={() =>
          addBarcode(state.name, state.barcodeValue, state.barcodeTypeIndex, state.logo)
        }>
        <Text style={styles.text}>Dodaj</Text>
      </Pressable>

      {state.splashVisible && <SplashScreen />}

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    padding: 5, // Added padding for better visibility on smaller devices
  },
  barcodeBoxOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: "#1C3A77",
    opacity: 0.9,
  },
  buttonScanAgain: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  typePickerWrapper: {
    width: "80%",
    borderColor: "#1C3A77",
    borderWidth: 3,
    flexDirection: "row",
    margin: 10,
  },
  typePicker: {
    flex: 4,
  },
  legend: {
    position: 'absolute',
    top: -15,
    left: 10,
    backgroundColor: '#FFFFFF',
    padding: 5,
    color: "#1C3A77",
    fontFamily: "Coda-Latin",
  },
  checkboxWrapper: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  checkbox: {
    marginBottom: 5,
    backgroundColor: "#1C3A77",
  },
  input: {
    height: 40,
    marginTop: 10,
    borderWidth: 1,
    marginHorizontal: 10,
    padding: 10,
    width: "80%",
    borderRadius: 4,
    backgroundColor: "#D6D9E0",
    color: "#333333",
    fontFamily: "Coda-Latin",
  },
  barcodebox: {
    alignItems: "center",
    justifyContent: "center",
    width: "70%", // Adjusted width to 100% to better fit smaller devices
    height: 220, // Adjusted height for smaller devices
    overflow: "hidden",
    borderRadius: 50, 
    backgroundColor: "#1C3A77",
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#D6D9E0",
    marginTop: 30,
  },
  buttonLogo: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    margin: 10,
    borderRadius: 4,    
    backgroundColor: "#1C3A77",
  },
  pressable: {
    backgroundColor: "#1C3A77",
    paddingHorizontal: 50,
    paddingVertical: 10,
    borderRadius: 50,
    margin: 15,
    borderColor: "#D6D9E0",
    borderWidth: 2,
  },
  text: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14, // Adjusted font size for smaller devices
    fontFamily: "Coda-Latin",
    textAlign: "center",
    alignSelf: "center", // Adjusted to align text at the center
  },
  logo: {
    resizeMode: 'contain',
    height: 80,
    width: 80,
  },
  logoRow: {
    display: 'flex',
    flexDirection: 'row',
    width: '80%',
    padding: 10,
    justifyContent: 'space-evenly',
  }
});

