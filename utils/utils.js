import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import * as Font from 'expo-font';
import { logos } from '../assets/logos'
import { manipulateAsync, getImageInfoAsync } from 'expo-image-manipulator';
import { log } from "react-native-reanimated";


export const updateBarcode = async (selectedBarcode, updatedBarcode) => {
  try {
    const barcodes = await getData();
    const updatedBarcodes = barcodes.map(barcode => {
      if (barcode.barcode === selectedBarcode.barcode) {
        return updatedBarcode;
      } else {
        return barcode;
      }
    });
    await AsyncStorage.setItem("barcodes", JSON.stringify(updatedBarcodes));
  } catch (error) {
    console.error(error);
  }
};

const testBARCODES = [
  {
    title: 'BIEDRONKA',
    barcode: '978020137962',
    type: 'EAN13',
    logo: logos[0],
  },
  {
    title: 'ORLEN',
    barcode: '123456789123',
    type: 'EAN13',
    logo: logos[1],
  },
  {
    title: 'LIDL',
    barcode: '223456789123',
    type: 'EAN13',
    logo: logos[2],
  },
  {
    title: 'TESCO',
    barcode: '443456789123',
    type: 'EAN13',
    logo: logos[3],
  },
  {
    title: 'TESTCO',
    barcode: '553456789123',
    type: 'EAN13',
    logo: logos[4],
  },
  {
    title: 'SHEESH',
    barcode: '663456789123',
    type: 'EAN13',
    logo: logos[5],
  },
];

export const storeData = async () => {
  try {
    // await AsyncStorage.clear(); //refresh
    const data = await AsyncStorage.getItem('barcodes');
    if (!data || data.length === 0) {
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

export const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("barcodes");
    return jsonValue !== null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.log(e);
  }
}

export const deleteBarcode = (barcode, navigation) => {
  Alert.alert(
    "Usuń kartę",
    "Czy jesteś pewny/a, że chcesz usunąć tę kartę?",
    [
      {
        text: "Wyjdź",
        onPress: () => console.log("Wyjście..."),
        style: "cancel",
      },
      {
        text: "Usuń",
        onPress: async () => {
          try {
            const barcodes = await getData();
            const updatedBarcodes = barcodes.filter(
              (item) => item.barcode !== barcode.barcode
            );
            await AsyncStorage.setItem(
              "barcodes",
              JSON.stringify(updatedBarcodes)
            );
            //setBARCODES(updatedBarcodes);
          } catch (e) {
            console.log(e);
          }
          navigation.navigate("ListScreen", { deleted: true });
        },
        style: "destructive",
      },
    ]
  );
};

export const getLogos = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("uploadedLogos");
    return jsonValue !== null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.log(e);
  }
}



export const loadFonts = async () => {
  return await Font.loadAsync({
    'Actor': require('../assets/fonts/Actor-Regular.ttf'),
    'Coda-Latin': require('../assets/fonts/coda-latin-400-normal.ttf'),
    'Coda-Latin-Bold': require('../assets/fonts/coda-latin-800-normal.ttf'),
    'Coda-Latin-SemiBold': require('../assets/fonts/coda-latin-ext-400-normal.ttf'),
    'Coda-Latin-ExtraBold': require('../assets/fonts/coda-latin-ext-800-normal.ttf'),
  });
};




