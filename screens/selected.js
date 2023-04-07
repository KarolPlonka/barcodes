import React, { useState } from "react";
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    Dimensions,
    View,
    Alert,
} from "react-native";
import Barcode from "@kichiyaki/react-native-barcode-generator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import * as Brightness from 'expo-brightness';
import { Feather } from '@expo/vector-icons';


export default function SelectedScreen({ route }) {
    const navigation = useNavigation();
    const selectedBarcode = route.params.selectedBarcode;
    const [hasPermission, setHasPermission] = useState(false);

    const setMaxBrightness = async () => {
        if (!hasPermission) {
            let status = await Brightness.requestPermissionsAsync();
            setHasPermission(status)
        }
        Brightness.setSystemBrightnessAsync(1);
    }

    const getData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem("barcodes");
            return jsonValue !== null ? JSON.parse(jsonValue) : [];
        } catch (e) {
            console.log(e);
        }
    };

    const deleteBarcode = (barcode) => {
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
                                (item) => item.barcode !== barcode
                            );
                            await AsyncStorage.setItem(
                                "barcodes",
                                JSON.stringify(updatedBarcodes)
                            );
                            //setBARCODES(updatedBarcodes);
                        } catch (e) {
                            console.log(e);
                        }
                        navigation.navigate("MainScreen", { deleted: true });
                    },
                    style: "destructive",
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container} >
            <View style={styles.singleItem}>

                <View style={styles.titleWrapper}>
                    <Text style={styles.title}>
                        {selectedBarcode.title}
                    </Text>
                </View>

                <View style={styles.barcodeWrapper}>
                    <Barcode
                        format={selectedBarcode.type}
                        value={selectedBarcode.barcode}
                        text={selectedBarcode.barcode}
                        width={10}
                        height={Dimensions.get("window").height / 2}
                        maxWidth={Dimensions.get("window").width - 50}
                        background={"#6e3b6e"}
                        color={"white"}
                    />
                </View>

                <TouchableOpacity
                    onPress={() => { deleteBarcode(selectedBarcode.barcode) }}
                    style={styles.deleteButton}
                >
                    <Feather name="trash" size={30} color="black" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => { setMaxBrightness() }}
                    style={styles.brightnessButton}
                >
                    <Feather name="sun" size={30} color="black" />
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
    title: {
        color: "black",
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
    },
    deleteButton: {
        position: "absolute",
        bottom: 20,
        right: 20,
    },
    brightnessButton: {
        position: "absolute",
        top: 20,
        right: 20,
    },
    titleWrapper: {
        marginBottom: 10,
    },
    barcodeWrapper: {
        marginBottom: 10,
    },
});
