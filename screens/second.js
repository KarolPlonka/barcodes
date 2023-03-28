import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Pressable, TextInput } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState('Not yet scanned')
  const [name, setName] = useState('')
  const [barcodeValue, setBarcodeValue] = useState('');

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
    setText(data)
    setBarcodeValue(data)
    console.log('Type: ' + type + '\nData: ' + data)
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
  
  function addBarcode(name, data) {
    appendData(  {
        id: 69,
        title: {name},
        barcode: {data},
      },)

    console.log('Name: ' + name + '\tData: ' + data)
  };


  // Check permissions and return the screens
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting for camera permission</Text>
      </View>)
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 10 }}>No access to camera</Text>
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

      {scanned && <Button title={'Scan again?'} onPress={() => setScanned(false)} color='black' />}

      <TextInput 
        style={styles.input}
        value={barcodeValue}
        onChangeText={setBarcodeValue}
        placeholder="barcode"
      />

      <TextInput 
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="name"
      />

      <Pressable style = {styles.button} onPress={() => addBarcode(name, barcodeValue)}>
        <Text>Add</Text>
      </Pressable>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderColor: 'grey',
    width: 200,
    padding: 10,
  },
  barcodebox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    width: 400,
    overflow: 'hidden',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    width: 200,
    borderRadius: 4,
    elevation: 3,
    marginVertical: 30,
    backgroundColor: 'black',
  }
});