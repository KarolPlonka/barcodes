import React, { useState, useEffect, useCallback } from "react";
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    Dimensions,
    View,
    RefreshControl,
    Alert,
} from "react-native";

import DraggableFlatList, {ScaleDecorator,} from "react-native-draggable-flatlist";
import colors from "../assets/colors";
import Barcode from "@kichiyaki/react-native-barcode-generator";
import AsyncStorage from "@react-native-async-storage/async-storage";



const Item = ({ item, drag, onPress, onDelete, backgroundColor, textColor, selectedBarcode }) => {
    const isSelected = item.barcode === selectedBarcode;
  
    return (
        <ScaleDecorator>
            <TouchableOpacity onPress={onPress} onLongPress={drag} style={styles.item}>
                <View style={styles.titleWrapper} >
                    <Text style={styles.title}>{item.title}</Text>
                </View>

                <View style={styles.barcodeWrapper}>
                    <Barcode
                        format="EAN13"
                        value={item.barcode}
                        text={item.barcode}
                        maxWidth={Dimensions.get('window').width - 100}
                        background={backgroundColor}
                        color={textColor}
                    />
                </View>

                {isSelected && (
                    <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
                        <Text style={styles.deleteButtonText}>X</Text>
                    </TouchableOpacity>
                )}
            </TouchableOpacity>
        </ScaleDecorator>
    );
  };
  


  
const getData = async () => {
    try {
        console.log("refreshed data");
        const jsonValue = await AsyncStorage.getItem("barcodes");
        console.log(jsonValue);
        return jsonValue !== null ? JSON.parse(jsonValue) : null;
        
    } catch (e) {
        console.log(e);
    }
};

export default function MainScreen({ navigation, route }) {
    const [BARCODES, setBARCODES] = useState([]);
    const [selectedBarcode, setSelectedBarcode] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    

    const loadBarcodes = () => {
        const getDataAndSetState = async () => {
            const jsonData = await getData();
            if (jsonData) {
                setBARCODES(jsonData);
            }
        };
        getDataAndSetState();
    };

    useEffect(() => {
        loadBarcodes();
    }, []);

    const deleteBarcode = (barcode) => {
        Alert.alert(
            "Usuń kartę",
            "Czy jesteś pewny/a, że chcesz usunąć tę kartę?",
            [
                {
                    text: "Wyjdź",
                    onPress: () => console.log("Wyjście..."),
                    style: "cancel"
                },
                {
                    text: "Usuń",
                    onPress: async () => {
                        try {
                            const barcodes = await AsyncStorage.getItem("barcodes");
                            if (barcodes !== null) {
                                const updatedBarcodes = JSON.parse(barcodes).filter(
                                    (item) => item.barcode !== barcode
                                );
                                await AsyncStorage.setItem("barcodes", JSON.stringify(updatedBarcodes));
                                setBARCODES(updatedBarcodes);
                            }
                        } catch (e) {
                            console.log(e);
                        }
                    },
                    style: "destructive"
                }
            ]
        );
    };



    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        loadBarcodes();
        setRefreshing(false);
    }, []);

    const renderItem = ({ item, drag, isActive }) => {
        const backgroundColor = item.barcode === selectedBarcode ? '#6e3b6e' : 'white';
        const color = item.barcode === selectedBarcode ? 'white' : '#6e3b6e';

        return (
            <Item
              item={item}
              drag={drag}
              onPress={() => setSelectedBarcode(selectedBarcode === item.barcode ? null : item.barcode)}
              onDelete={() => deleteBarcode(item.barcode)}
              backgroundColor={backgroundColor}
              textColor={color}
              selectedBarcode={selectedBarcode}
            />
          );
    };

    const hadnleDragDrop = ({ data }) => {
        const storeData = async () => {
            try {
                await AsyncStorage.setItem('barcodes', JSON.stringify(data))
            } catch (e) {
                console.log(e)
            }
            }
        storeData()
        setBARCODES(data)
    };

    return (
        <SafeAreaView style={styles.container}>
            <DraggableFlatList
                data={BARCODES}
                onDragEnd={hadnleDragDrop} 
                keyExtractor={(item) => item.barcode}
                renderItem={renderItem}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            />  
            <View
                style={styles.addButtonWrapper}
            >
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
    container: {
        flex: 1,
        backgroundColor: "#f0e6d2",
        marginTop: StatusBar.currentHeight || 0,
    },
    item: {
        backgroundColor: "black",
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
});
