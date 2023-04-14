import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const appendData = async (newElement) => {
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

export { appendData, checkBarcode };