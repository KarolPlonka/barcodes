import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  Pressable,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import SplashScreen from "./splash";

const barcodeTypes = new Map([
  ["org.gs1.EAN-13", "EAN13"],
  [512, "EAN13"],
]);

export default function AddScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [name, setName] = useState("");
  const [barcode, setBarcode] = useState({ barcode: "", type: "" });
  const [borderColor, setBorderColor] = useState("#CCCCCC");
  const [splashVisible, setSplashVisible] = useState(false);
  const navigation = useNavigation();

  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  };

  // Request Camera Permission
  useEffect(() => {
    askForCameraPermission();
  }, []);

  // What happens when we scan the bar code
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setBarcode({ barcode: data, type: type });
    console.log("Typ: " + type + "\t Kod kreskowy: " + data);
    if (!barcodeTypes.has(type)) {
      setBorderColor("#FF0000"); // set red border for invalid barcode type
    } else {
      setBorderColor("#00FF00"); // set green border for valid barcode type
    }
  };

  const appendData = async (newElement) => {
    let myArray = null;
    try {
      const data = await AsyncStorage.getItem("barcodes");
      myArray = data ? JSON.parse(data) : [];
      myArray.push(newElement);
      await AsyncStorage.setItem("barcodes", JSON.stringify(myArray));
    } catch (error) {
      console.error(error);
    } finally {
      setBarcode(myArray);
    }
  };

  // check if barcode already exists
  const checkBarcode = async (barcode) => {
    let myArray = null;
    try {
      const data = await AsyncStorage.getItem("barcodes");
      myArray = data ? JSON.parse(data) : [];
      console.log(myArray);
      for (const element of myArray) {
        if (element.barcode === barcode) {
          Alert.alert("Błąd", "Kod kreskowy już istnieje");
          return true;
        }
      }
    } catch (error) {
      console.error(error);
    }
    return false;
  };

  async function addBarcode(name, barcode) {
    if (!name || !barcode.barcode) {
      Alert.alert("Błąd", "Wypełnij wszystkie pola");
      return;
    }

    if (!barcodeTypes.has(barcode.type)) {
      Alert.alert("Nieobsługiwany typ kodu kreskowego");
      return;
    }

    const barcodeExists = await checkBarcode(barcode.barcode);
    if (barcodeExists) {
      return;
    }

    setSplashVisible(true);

    setTimeout(async () => {
      await appendData({
        title: name,
        barcode: barcode.barcode,
        type: barcodeTypes.get(barcode.type),
      });
      console.log(
        "Nazwa: " +
          name +
          "\tData: " +
          barcode.barcode +
          "Type: " +
          barcode.type
      );
      navigation.navigate("MainScreen", { newBarcode: barcode }); // navigate to the MainScreen component with the new barcode
      setSplashVisible(false);
    }, 2000);
  }

  // Check permissions and return the screens
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Requesting for camera permission</Text>
      </View>
    );
  }
  if (hasPermission === false) {
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

  // Return the View
  return (
    <View style={styles.container}>
      <View style={[styles.barcodebox, { borderColor }]}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{ height: 400, width: 400 }}
        />
      </View>
      {scanned && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setScanned(false);
            setBorderColor("#CCCCCC");
          }}
        >
          <Text style={styles.text}>Kliknij, aby zeskanować ponownie</Text>
        </TouchableOpacity>
      )}

      <TextInput
        style={styles.input}
        value={barcode.barcode}
        onChangeText={setBarcode}
        placeholder="barcode"
        placeholderTextColor="#9E9E9E"
      />

      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="name"
        placeholderTextColor="#9E9E9E"
      />
      {splashVisible && <SplashScreen />}
      <Pressable
        style={styles.pressable}
        onPress={() => addBarcode(name, barcode)}
      >
        <Text style={styles.text}>Dodaj</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0e6d2",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
    width: "80%",
    color: "#000000",
    padding: 10,
  },
  barcodebox: {
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    height: "40%",
    overflow: "hidden",
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
    borderWidth: 2,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    padding: 10,
    borderRadius: 4,
    backgroundColor: "#6e3b6e",
  },
  pressable: {
    backgroundColor: "#6e3b6e",
    paddingHorizontal: 50,
    paddingVertical: 10,
    borderRadius: 4,
    margin: 10,
  },
  text: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
