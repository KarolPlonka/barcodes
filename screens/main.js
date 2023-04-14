// React and React Native modules
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  Dimensions,
  View,
} from "react-native";

// Navigation modules
import { useIsFocused } from '@react-navigation/native';

// Third-party modules
import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist";
import Barcode from "@kichiyaki/react-native-barcode-generator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from '@expo/vector-icons';

// Local modules
import SplashScreen from "./splash";
import styles from "../assets/styles";
import { storeData } from "../utils/utils";

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

const handleDragDrop = (data, setBARCODES) => {
  AsyncStorage.setItem("barcodes", JSON.stringify(data)).catch((e) => console.log(e));
  setBARCODES(data);
};

const MainScreen = ({ navigation }) => {
  const [BARCODES, setBARCODES] = useState([]);
  const [splashVisible, setSplashVisible] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    const loadBarcodes = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("barcodes");
        const jsonData = jsonValue !== null ? JSON.parse(jsonValue) : [];
        setBARCODES(jsonData);
      } catch (e) {
        console.log(e);
      }
    };
    if (isFocused) {
      loadBarcodes();
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
      navigation.navigate("MainScreen");
      storeData();
      setSplashVisible(false);
    }, 2000); // Adjust this time based on your splash screen animation duration
  };

  return (
    <SafeAreaView style={styles.container}>
      {splashVisible && <SplashScreen />}
      <View style={{ flex: 1, marginBottom: 10 }}>
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

export default MainScreen;