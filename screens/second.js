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
  Modal,
  Image,
} from "react-native";
import { StyleSheet } from "react-native";

// Import Expo BarCodeScanner and react-navigation hook
import { BarCodeScanner } from "expo-barcode-scanner";
import { useNavigation } from "@react-navigation/native";

import LogoPicker from "../components/logoPicker";

// Import custom components and functions
import SplashScreen from "./splash";
import ScrollPicker from "react-native-wheel-scrollview-picker";
import {
  validateBarcode,
  barcodeTypes,
  barcodeTypesMap,
} from "./barcodesHandler";
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
    if (!barcodeTypesMap.has(type)) {
      dispatch({ type: "SET_BORDER_COLOR", payload: "#FF0000" });
    } else {
      dispatch({ type: "SET_BORDER_COLOR", payload: "#00FF00" });
      dispatch({
        type: "SET_BARCODE_TYPE_INDEX",
        payload: barcodeTypesMap.get(type),
      });
    }
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
        type: barcodeTypes[barcodeTypeIndex],
        logo: logo,
      });
      navigation.navigate("MainScreen", { newBarcode: barcodeValue });
      dispatch({ type: "SET_SPLASH_VISIBLE", payload: false });
    }, 5000);
  }

  // Check permissions and return the actual screen
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

  const findType = (barcodeValue) => {
    for (let i = 0; i < barcodeTypes.length; i++) {
      if (validateBarcode(barcodeValue, i)) {
        return i;
      }
    }
    return null;
  };

  const handleTypeInput = (data, selectedIndex) => {
    dispatch({ type: "SET_BARCODE_TYPE_INDEX", payload: selectedIndex });
    if (state.barcodeValue === "") {
      dispatch({ type: "SET_IS_BARCODE_VALID", payload: null });
      return;
    }
    if (validateBarcode(state.barcodeValue, selectedIndex)) {
      dispatch({ type: "SET_IS_BARCODE_VALID", payload: true });
      return;
    }
    dispatch({ type: "SET_IS_BARCODE_VALID", payload: false });
  };

  const handleBarcodeInput = (newType) => {
    dispatch({ type: "SET_BARCODE_VALUE", payload: newType });
    if (newType === "") {
      dispatch({ type: "SET_IS_BARCODE_VALID", payload: null });
      return;
    }
    let typeIndex = findType(newType);
    if (typeIndex !== null) {
      dispatch({ type: "SET_BARCODE_TYPE_INDEX", payload: typeIndex });
      dispatch({ type: "SET_IS_BARCODE_VALID", payload: true });
      return;
    }
    dispatch({ type: "SET_IS_BARCODE_VALID", payload: false });
  };

  const renderType = (data, index) => {
    const textStyle = index === state.barcodeTypeIndex ? { fontSize: 30 } : {};
    return (
      <View>
        <Text style={textStyle}>{data}</Text>
      </View>
    );
  };

  const handleLogoPick = (logo) => {
    dispatch({ type: "SET_IS_LOGO_PICKER_VISBLE", payload: false });
    dispatch({ type: "SET_LOGO", payload: logo });
  }

  return (
    <View style={styles.container} onLayout={handleOnLayout}>
      <View style={[styles.barcodebox, { borderColor: state.borderColor }]}>
        <BarCodeScanner
          onBarCodeScanned={state.scanned ? undefined : handleBarCodeScanned}
          style={{ height: 400, width: 400 }}
        />
      </View>
      {state.scanned && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            dispatch({ type: "SET_SCANNED", payload: false });
            dispatch({ type: "SET_BORDER_COLOR", payload: "#CCCCCC" });
            dispatch({ type: "SET_BARCODE_VALUE", payload: "" });
            dispatch({ type: "SET_BARCODE_TYPE_INDEX", payload: null });
          }}
        >
          <Text style={styles.text}>Kliknij, aby zeskanować ponownie</Text>
        </TouchableOpacity>
      )}
      <View style={styles.typePicker}>
        <ScrollPicker
          dataSource={barcodeTypes}
          selectedIndex={state.barcodeTypeIndex}
          renderItem={renderType}
          onValueChange={handleTypeInput}
          wrapperHeight={180}
          wrapperWidth={150}
          wrapperColor="#FFFFFF"
          itemHeight={60}
          highlightColor="#d8d8d8"
          highlightBorderWidth={2}
        />
      </View>

      <View style={styles.logoRow}>
        {state.logo !== null && <Image source={state.logo.uri} style={styles.logo} />}

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            dispatch({ type: "SET_IS_LOGO_PICKER_VISBLE", payload: true });
          }}
        >
          <Text>Select Logo</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        visible={state.isLogoPickerVisible}
      >
        <LogoPicker onLogoPress={handleLogoPick}/>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            dispatch({ type: "SET_IS_LOGO_PICKER_VISBLE", payload: false });
            dispatch({ type: "SET_LOGO", payload: null });
          }}
        >
          <Text>No logo</Text>
        </TouchableOpacity>
      </Modal>

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
      {state.splashVisible && <SplashScreen />}
      <Pressable
        style={styles.pressable}
        onPress={() =>
          addBarcode(state.name, state.barcodeValue, state.barcodeTypeIndex, state.logo)
        }>
        <Text style={styles.text}>Dodaj</Text>
      </Pressable>
    </View>
  );
}


const styles = StyleSheet.create({
    typePicker: {
        height: 150,
        width: "80%",
        padding: 10,
    },
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
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
        width: "80%",
        height: "35%",
        overflow: "hidden",
        borderRadius: 50, //Changed from 4 to 50
        backgroundColor: "#1C3A77",
        marginBottom: 20,
        borderWidth: 2,
        borderColor: "#D6D9E0",
    },
    button: {
        alignItems: "center",
        justifyContent: "center",
        margin: 10,
        padding: 10,
        borderRadius: 4,
        backgroundColor: "#FF6B6C",
    },
    pressable: {
        backgroundColor: "#1C3A77",
        paddingHorizontal: 50,
        paddingVertical: 10,
        borderRadius: 50, //Changed from 4 to 50
        margin: 10,
        borderColor: "#D6D9E0",
        borderWidth: 2,
    },
    text: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 16,
        fontFamily: "Coda-Latin",
        textAlign: "center",
        alignSelf: "flex-start", //Added to experiment with unusual text alignments
    },
    logo: {
      resizeMode: 'contain',
      height: 60,
      width: 200,
    },
    logoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
    }
});

