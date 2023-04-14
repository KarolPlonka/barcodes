import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const testBARCODES = [
  {
    title: 'BIEDRONKA',
    barcode: '978020137962',
    type: 'EAN13'
  },
  {
    title: 'ORLEN',
    barcode: '123456789123',
    type: 'EAN13'
  },
  {
    title: 'LIDL',
    barcode: '223456789123',
    type: 'EAN13'
  },
  {
    title: 'TESCO',
    barcode: '443456789123',
    type: 'EAN13'
  },
  {
    title: 'TESTCO',
    barcode: '553456789123',
    type: 'EAN13'
  },
  {
    title: 'SHEESH',
    barcode: '663456789123',
    type: 'EAN13'
  },
];

export const storeData = async () => {
  try {
    const data = await AsyncStorage.getItem('barcodes')
    if (!data) {
      await AsyncStorage.setItem('barcodes', JSON.stringify(testBARCODES))
      return;
    }
  } catch (e) {
    console.log(e)
  }
}

export const appendData = async (newElement) => {
  let myArray = null;
  try {
    const data = await AsyncStorage.getItem("barcodes");
    myArray = data ? JSON.parse(data) : [];
    myArray.push(newElement);
    await AsyncStorage.setItem("barcodes", JSON.stringify(myArray));
  } catch (error) {
    console.error(error);
  }
};

// check if barcode already exists
export const checkBarcode = async (barcode) => {
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

