import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Pressable, TextInput, TouchableOpacity, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import AsyncStorage from '@react-native-async-storage/async-storage';

const barcodeTypes = new Map([
  [32, 'EAN13'],
])

export default function AddScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [name, setName] = useState('')
  const [barcode, setBarcode] = useState({ barcode: '', type: '' });

  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })()
  }

  // Request Camera Permission
  useEffect(() => {
    askForCameraPermission();
  }, []);

  // What happens when we scan the bar code
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setBarcode({ barcode: data, type: type });
    console.log('Typ: ' + type + '\t Kod kreskowy: ' + data);
  };


  const appendData = async (newElement) => {
    let myArray = [];
    try {
      const data = await AsyncStorage.getItem('barcodes');
      if (data) {
        myArray = JSON.parse(data);
      }
      myArray.push(newElement);
      await AsyncStorage.setItem('barcodes', JSON.stringify(myArray));
    } catch (error) {
      console.error(error);
    }
  };


  function addBarcode(name, barcode) {
    if (!name || !barcode.barcode) {
      Alert.alert(
        "Błąd",
        "Wypełnij wszystkie pola",
      )
      return;
    }

    if (!barcodeTypes.has(barcode.type)){
      Alert.alert("Nieobsługiwany typ kodu kreskowego")
      return;
    }

    appendData({
      title: name,
      barcode: barcode.barcode,
      type: barcodeTypes.get(barcode.type),
    })

    console.log('Nazwa: ' + name + '\tData: ' + barcode.barcode + '\Type: ' + barcode.type)
  };


  // Check permissions and return the screens
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Requesting for camera permission</Text>
      </View>)
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No access to camera</Text>
        <Button title={'Allow Camera'} onPress={() => askForCameraPermission()} />
      </View>)
  }


  // Return the View
  return (
    <View style={styles.container}>
      <View style={styles.barcodebox}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{ height: 400, width: 400 }} />
      </View>

      {scanned && <TouchableOpacity style={styles.button} onPress={() => setScanned(false)}>
        <Text style={styles.text}>Kliknij, aby zeskanować ponownie</Text>
      </TouchableOpacity>}

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

      <Pressable style={styles.pressable} onPress={() => addBarcode(name, barcode)}>
        <Text style={styles.text}>Dodaj</Text>
      </Pressable>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0e6d2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    width: '80%',
    color: '#000000',
    padding: 10,
  },
  barcodebox: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    height: '40%',
    overflow: 'hidden',
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    padding: 10,
    borderRadius: 4,
    backgroundColor: '#6e3b6e',
  },
  pressable: {
    backgroundColor: '#6e3b6e',
    paddingHorizontal: 50,
    paddingVertical: 10,
    borderRadius: 4,
    margin: 10,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  }
});

