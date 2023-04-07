import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  View,
} from "react-native";
import { useIsFocused } from '@react-navigation/native'; // import useIsFocused

import DraggableFlatList, {ScaleDecorator,} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import colors from "../assets/colors";
import Barcode from "@kichiyaki/react-native-barcode-generator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from '@expo/vector-icons';
import SplashScreen from "./splash";



const Item = ({
  item,
  drag,
  onPress,
}) => {

  return (
    <ScaleDecorator >
      <TouchableOpacity
        onPress={onPress}
        onLongPress={drag}
        style={styles.item}
      >
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>
            {item.title}
          </Text>
        </View>

        <View style={styles.barcodeWrapper}>
          <Barcode
            format={item.type}
            value={item.barcode}
            text={item.barcode}
            maxWidth={Dimensions.get("window").width - 100}
            background={"#6e3b6e"}
            color={"white"}
          />
        </View>
      </TouchableOpacity>
    </ScaleDecorator>
  );
};

const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("barcodes");
    return jsonValue !== null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.log(e);
  }
};

export default function MainScreen({ navigation }) {
  const [BARCODES, setBARCODES] = useState([]);
  const [splashVisible, setSplashVisible] = useState(false);

  const isFocused = useIsFocused(); // use useIsFocused

  const loadBarcodes = () => {
    const getDataAndSetState = async () => {
      const jsonData = await getData();
      setBARCODES(jsonData);
    };
    getDataAndSetState();
  };

  useEffect(() => {
    if (isFocused) {
      loadBarcodes();
    }
  }, [isFocused]);

   // navigate to the MainScreen component with the new barcode
  const renderItem = ({ item, drag }) => {
    return (
      <Item
        item={item}
        drag={drag}
        onPress={() => {navigation.navigate("SelectedScreen", { selectedBarcode: item });}}
      />
    );
  };

  const handleDragDrop = ({ data }) => {
    const storeData = async (data) => {
      try {
        await AsyncStorage.setItem("barcodes", JSON.stringify(data));
      } catch (e) {
        console.log(e);
      }
    };
    storeData(data);
    setBARCODES(data);
  };

  function refreshPage() {
    setSplashVisible(true);
    setTimeout(() => {
      loadBarcodes();
      setSplashVisible(false);
    }, 2000); // Adjust this time based on your splash screen animation duration
  }


  return (
      <SafeAreaView style={styles.container} >
        {splashVisible && <SplashScreen />}


        <View style={styles.refreshButtonWrapper}>
          <TouchableOpacity onPress={refreshPage}>
            <Feather name="refresh-ccw" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1 }} >
          <GestureHandlerRootView style={{ flex: 1 }} >
            <DraggableFlatList
              data={BARCODES}
              renderItem={renderItem}
              keyExtractor={(item) => `draggable-item-${item.barcode}`}
              onDragEnd={({ data }) => handleDragDrop({ data })}
            />
          </GestureHandlerRootView>
        </View>

        <View style={styles.addButtonWrapper}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("AddScreen")}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
  );
  
}

const styles = StyleSheet.create({
  singleItem: {
    flex: 1,
    justifyContent: 'center',
    height: 500,
  },
  container: {
    flex: 1,
    backgroundColor: "#f0e6d2",
    marginTop: StatusBar.currentHeight || 0,
  },
  refreshButtonWrapper: {
    alignItems: "center",
    marginVertical: 5,
  },
  refreshButton: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#f0e6d2",
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: "white",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    color: "black",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 100,
    backgroundColor: "#6e3b6e",
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
  addButtonText: {
    color: "white",
    fontSize: 36,
  },
  deleteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 100,
    backgroundColor: "white",
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
  deleteButtonText: {
    color: "#6e3b6e",
    fontSize: 16,
    fontWeight: "bold",
  },
  titleWrapper: {
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
  scrollViewContent: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#6e3b6e",
    textAlign: "center",
  },
});
