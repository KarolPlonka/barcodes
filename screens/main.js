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
import { useIsFocused } from '@react-navigation/native';
import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist";
import colors from "../assets/colors";
import Barcode from "@kichiyaki/react-native-barcode-generator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from '@expo/vector-icons';
import SplashScreen from "./splash";

const Item = React.memo(({ item, drag, onPress }) => {
  return (
    <ScaleDecorator>
      <TouchableOpacity onPress={onPress} onLongPress={drag} style={styles.item}>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>{item.title}</Text>
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
    </ScaleDecorator>
  );
});

const loadBarcodes = async (setBARCODES) => {
  try {
    const jsonValue = await AsyncStorage.getItem("barcodes");
    const jsonData = jsonValue !== null ? JSON.parse(jsonValue) : [];
    setBARCODES(jsonData);
  } catch (e) {
    console.log(e);
  }
};

const handleDragDrop = (data, setBARCODES) => {
  AsyncStorage.setItem("barcodes", JSON.stringify(data)).catch((e) => console.log(e));
  setBARCODES(data);
};

const MainScreen = ({ navigation }) => {
  const [BARCODES, setBARCODES] = useState([]);
  const [splashVisible, setSplashVisible] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadBarcodes(setBARCODES);
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

  const refreshPage = () => {
    setSplashVisible(true);
    setTimeout(() => {
      loadBarcodes(setBARCODES);
      setSplashVisible(false);
    }, 2000); // Adjust this time based on your splash screen animation duration
  };

  return (
    <SafeAreaView style={styles.container}>
      {splashVisible && <SplashScreen />}
      <View style={{ flex: 1, marginBottom: 5 }}>
        <TouchableOpacity onPress={refreshPage} style={{ alignSelf: "center", marginVertical: 5 }}>
          <Feather name="refresh-ccw" size={24} color="black" />
        </TouchableOpacity>

        <DraggableFlatList
          data={BARCODES}
          renderItem={renderItem}
          keyExtractor={(item) => `draggable-item-${item.barcode}`}
          onDragEnd={({ data }) => handleDragDrop(data, setBARCODES)}
        />
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0e6d2",
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: "white",
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
});

export default MainScreen;