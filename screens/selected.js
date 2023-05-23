import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    Dimensions,
    View,
    Image,
} from "react-native";
import Barcode from "@kichiyaki/react-native-barcode-generator";
import { useNavigation } from "@react-navigation/native";
import * as Brightness from 'expo-brightness';
import { Feather } from '@expo/vector-icons';
import { updateBarcode, deleteBarcode } from "../utils/utils";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { MaterialIcons } from '@expo/vector-icons';

export default function SelectedScreen({ route }) {
    const navigation = useNavigation();
    const [selectedBarcode, setSelectedBarcode] = useState(route.params.selectedBarcode);
    const [hasPermission, setHasPermission] = useState(false);
    const [newBarcodeTitle, setNewBarcodeTitle] = useState(selectedBarcode.title);
    const [newBarcodeLogo, setNewBarcodeLogo] = useState(selectedBarcode.logo);
    const titleRef = useRef();
    const [fontsLoaded] = useFonts({
        'Actor': require('../assets/fonts/Actor-Regular.ttf'),
        'Coda-Latin': require('../assets/fonts/coda-latin-400-normal.ttf'),
        'Coda-Latin-Bold': require('../assets/fonts/coda-latin-800-normal.ttf'),
        'Coda-Latin-SemiBold': require('../assets/fonts/coda-latin-ext-400-normal.ttf'),
        'Coda-Latin-ExtraBold': require('../assets/fonts/coda-latin-ext-800-normal.ttf'),
    });
    const [editMode, setEditMode] = useState(false);
    const [isLogoPickerVisible, setIsLogoPickerVisible] = useState(false);

    const handleEditMode = (value) => {
        setEditMode(value);
    };

    const handleOnPress = () => {
        if (editMode) {
            updateBarcode(selectedBarcode, newBarcodeTitle);
            setSelectedBarcode({ ...selectedBarcode, title: newBarcodeTitle });
            setNewBarcodeTitle("");
            setEditMode(false);
        } else {
            handleEditMode(true);
        }
    };

    const handleOnLayout = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    useEffect(() => {
        //set cursor focus to title after loading edit mode
        if (editMode) titleRef.current.focus();
    }, [editMode]);

    const setMaxBrightness = async () => {
        if (!hasPermission) {
            let status = await Brightness.requestPermissionsAsync();
            setHasPermission(status)
        }
        Brightness.setSystemBrightnessAsync(1);
    }

    const handleBarcodeUpdate = () => {
        const updatedBarcode = {
            barcode: selectedBarcode.barcode,
            title: newBarcodeTitle,
            logo: newBarcodeLogo,
            type: selectedBarcode.type
        }
        updateBarcode(selectedBarcode, updatedBarcode);
        setSelectedBarcode(updatedBarcode);
        setEditMode(false);
    }

    const handleLogoPick = (logo) => {
        setNewBarcodeLogo(logo);
        setIsLogoPickerVisible(false);
    }

    const handleDeclinePress = () => {
        setEditMode(false);
        setNewBarcodeTitle(selectedBarcode.title);
        setNewBarcodeLogo(selectedBarcode.logo);
    }

    const handleNoLogoPress = () => {
        setNewBarcodeLogo(null);
        setIsLogoPickerVisible(false);
    }

    if (!fontsLoaded) {
        return null;
    }

    return (
        <SafeAreaView style={styles.container} onLayout={handleOnLayout} >
                <View style={styles.titleWrapper}>
                    {editMode ? (
                        <TextInput
                            multiline={true}
                            ref={titleRef}
                            style={[styles.title, { textAlign: "center", padding: 5, borderBottomWidth: 2, borderBottomColor: "#FF6B6C" }]}
                            value={newBarcodeTitle}
                            onChangeText={text => setNewBarcodeTitle(text)}
                        />
                    ) : (
                        <Text style={[styles.title, { textAlign: "center" }]}>
                            {selectedBarcode.title}
                        </Text>
                    )}

                    <View style={styles.logoWrapper}>
                        {newBarcodeLogo && <Image source={newBarcodeLogo.source} style={styles.logo} />}
                        
                        {editMode && !newBarcodeLogo && <View style={styles.logo}/>}

                        {editMode && <TouchableOpacity
                            style={styles.logoButton}
                            onPress={() => { setIsLogoPickerVisible(true) }}
                        >
                            <Feather name="image" size={45} color="white" />
                        </TouchableOpacity>}

                    </View>

                </View>


                <View style={[styles.barcodeWrapper, { borderColor: "#1C3A77", borderWidth: 2 }]}>
                    <Barcode
                        format={selectedBarcode.type}
                        value={selectedBarcode.barcode}
                        text={selectedBarcode.barcode}
                        width={10}
                        height={Dimensions.get("window").height / 2}
                        maxWidth={Dimensions.get("window").width - 50}
                        background={"white"}
                        color={"white"}
                    />
                </View>
        
                <TouchableOpacity
                    onPress={() => { deleteBarcode(selectedBarcode, navigation) }}
                    style={[styles.deleteButton, { backgroundColor: "#FF6B6C", borderRadius: 50, width: 50, height: 50, alignItems: "center", justifyContent: "center" }]}
                >
                    <Feather name="trash" size={30} color="white" />
                </TouchableOpacity>
                {editMode ? (<>
                    <TouchableOpacity
                        onPress={() => { handleBarcodeUpdate(selectedBarcode) }}
                        style={[styles.confirmButton, { backgroundColor: "#1C3A77", borderRadius: 50, width: 50, height: 50, alignItems: "center", justifyContent: "center" }]}
                    >
                        <Feather name="check" size={30} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleDeclinePress}
                        style={[styles.declineButton, { backgroundColor: "#FF6B6C", borderRadius: 50, width: 50, height: 50, alignItems: "center", justifyContent: "center" }]}
                    >
                        <Feather name="x" size={30} color="white" />
                    </TouchableOpacity>
                </>) : (
                    <TouchableOpacity
                        onPress={handleOnPress}
                        style={[styles.editButton, { backgroundColor: "#1C3A77", borderRadius: 50, width: 50, height: 50, alignItems: "center", justifyContent: "center" }]}
                    >
                        <Feather name="edit" size={30} color="white" />
                    </TouchableOpacity>
                )}

                {!editMode &&
                <TouchableOpacity
                    onPress={() => { setMaxBrightness() }}
                    style={[styles.brightnessButton, { backgroundColor: "#1C3A77", borderRadius: 50, width: 50, height: 50, alignItems: "center", justifyContent: "center" }]}
                >
                    <Feather name="sun" size={30} color="white" />
                </TouchableOpacity>}

                {!editMode &&
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={[styles.comeBackButton, { backgroundColor: "#1C3A77", borderRadius: 50, width: 50, height: 50, alignItems: "center", justifyContent: "center" }]}
                >
                    <MaterialIcons name="arrow-back" size={30} color="white" />
                </TouchableOpacity>}

                
                <LogoPicker
                    visible={isLogoPickerVisible}
                    onLogoPress={handleLogoPick}
                    onNoLogoPress={handleNoLogoPress}
                    backAction={() => {setIsLogoPickerVisible(false)}}
                />


        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#D6D9E0",
        marginTop: StatusBar.currentHeight || 0,
        borderRadius: 10,
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    title: {
        color: "#1C3A77",
        fontSize: 24,
        fontWeight: "bold",
        fontFamily: "Coda-Latin-Bold",
        marginBottom: 10,
        flexWrap: "wrap",
        flexShrink: 1,
    },
    deleteButton: {
        position: "absolute",
        bottom: 20,
        right: 20,
    },
    editButton: {
        position: "absolute",
        bottom: 20,
        right: 80,
    },
    confirmButton: {
        position: "absolute",
        bottom: 20,
        right: 140,
    },
    declineButton: {
        position: "absolute",
        bottom: 20,
        right: 80,
    },
    brightnessButton: {
        position: "absolute",
        top: 20,
        right: 20,
    },
    titleWrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
      },
    barcodeWrapper: {
        padding: 15,
        backgroundColor: "white",
        marginBottom: 10,
        alignSelf: "center",
        justifyContent: "center",
        borderRadius: 10,
        overflow: "hidden",
    },
    comeBackButton: {
        position: "absolute",
        top: 20,
        left: 20,
    },
    logo: {
      resizeMode: 'contain',
      height: 60,
      width: 100,
    },
    logoButton: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        borderWidth: 3,
        borderRadius: 10,
        borderColor: '#555',
    },
    logoWrapper: {
        padding: 5,
        marginLeft: 20,
    }
});