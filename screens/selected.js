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

import FixedButton from "../components/FixedButton";

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

    const titleColor = selectedBarcode.logo && selectedBarcode.logo.colors ? selectedBarcode.logo.colors[0] : "#1C3A77";
    const borderColor = selectedBarcode.logo && selectedBarcode.logo.colors ? selectedBarcode.logo.colors[1] : "#1C3A77";

    const handleEditPress = () => {
        if (editMode) {
            updateBarcode(selectedBarcode, newBarcodeTitle);
            setSelectedBarcode({ ...selectedBarcode, title: newBarcodeTitle });
            setNewBarcodeTitle("");
            setEditMode(false);
        } else {
            setEditMode(true);
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
                            style={[styles.title, {borderBottomWidth: 2, borderBottomColor: "#FF6B6C", color: titleColor }]}
                            value={newBarcodeTitle}
                            onChangeText={text => setNewBarcodeTitle(text)}
                        />
                    ) : (
                        <Text style={[styles.title, {color: titleColor}]}>
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

                {!editMode && <>
                <FixedButton
                    onPress={() => navigation.goBack()}
                    icon="arrow-left"
                    position={{ top: 20, left: 20 }}
                />
                <FixedButton
                    onPress={setMaxBrightness}
                    icon="sun"
                    position={{ top: 20, right: 20 }}
                />
                </>}


                <View style={[styles.barcodeWrapper, {borderColor: borderColor}]}>
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

                {!editMode ? (
                    <FixedButton
                        onPress={handleEditPress}
                        icon="edit"
                        position={{ bottom: 20, right: 80, }}
                />
                ) : (<>
                    <FixedButton
                        onPress={() => { handleBarcodeUpdate(selectedBarcode) }}
                        icon="check"
                        position={{ bottom: 20, right: 140, }}
                    />
                    <FixedButton
                        onPress={handleDeclinePress}
                        icon="x"
                        position={{ bottom: 20, right: 80, }}
                        customStyles={{ backgroundColor: "#FF6B6C" }}
                    />
                </>)}

                <FixedButton
                    onPress={() => deleteBarcode(selectedBarcode, navigation)}
                    icon="trash"
                    position={{ bottom: 20, right: 20 }}
                    customStyles={{ backgroundColor: "#FF6B6C" }}
                />

                
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
        fontSize: 24,
        fontWeight: "bold",
        fontFamily: "Coda-Latin-Bold",
        marginBottom: 10,
        flexWrap: "wrap",
        flexShrink: 1,
        textAlign: "center",
        padding: 5,
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
        borderWidth: 5,
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