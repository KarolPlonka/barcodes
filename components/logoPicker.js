import React, { useState, useEffect } from 'react';
import {
    View,
    Button,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    Dimensions,
    Modal,
    Alert,
} from 'react-native';
import { launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { logos } from '../assets/logos';
import { getLogos, getImageData } from '../utils/utils';
import { getImagePalette } from '../utils/imagePaletteExctractor';

export default LogoPicker = ({ visible, onLogoPress, onNoLogoPress, backAction }) => {
    const [uploadedLogos, setUploadedLogos] = useState([]);

    useEffect(() => {
        // AsyncStorage.setItem('uploadedLogos', JSON.stringify([]));

        const loadUploadedLogos = async () => {
            try {
                const logos = await getLogos();
                setUploadedLogos(logos);
            } catch (e) {
                console.log(e);
            }
        };

        loadUploadedLogos();
    }, []);

    const onLogoDeletePress = (toDel) => {
        Alert.alert(
            "Usuń Logo",
            "Czy jesteś pewny/a, że chcesz usunąć to logo?",
            [
                {
                    text: "Wyjdź",
                    style: "cancel",
                },
                {
                    text: "Usuń",
                    onPress: async () => {
                        try {
                            const logos = await getLogos();
                            const updatedLogos = logos.filter(
                                (item) => item.id !== toDel.id
                            );
                            await AsyncStorage.setItem(
                                "uploadedLogos",
                                JSON.stringify(updatedLogos)
                            );
                            setUploadedLogos(updatedLogos);
                        } catch (e) {
                            console.log(e);
                        }
                    },
                    style: "destructive",
                },
            ]
        );
    };



    renderLogo = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => onLogoPress(item)} style={styles.item}>

                {!item.buildIn && 
                <TouchableOpacity
                    onPress={() => onLogoDeletePress(item)}
                    style={styles.deleteLogoBtn}
                > 
                    <Text>
                        <Feather name="x-circle" size={20} color="red"/>
                    </Text>
                </TouchableOpacity>}

                <Image source={item.source} style={styles.logo} resizeMode={"contain"} />

            </TouchableOpacity>
        )
    }

    return (
        <Modal
            visible={visible}
            animationType='slide'
            onRequestClose={backAction}
        >
            <FlatList
                data = { logos.concat(uploadedLogos) }
                numColumns={3}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderLogo}
                contentContainerStyle={styles.grid}
            >
            </FlatList>

            <ImagePicker setUploadedLogos = {setUploadedLogos} />


            <TouchableOpacity
                style={styles.button}
                onPress={() => onNoLogoPress()}
            >
                <Text>No logo</Text>
            </TouchableOpacity>
        </Modal>
    )
};

function ImagePicker( {setUploadedLogos } ) {

    const pickImage = async () => {
        const result = await launchImageLibraryAsync({
            mediaTypes: MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0,
        });

        if (!result.canceled) {
            const imageUri = result.assets[0].uri;

            // try{
            //     // const imageData = await getImageData(imageUri);
            //     // const palette = getImagePalette(imageData);
            //     // console.log(palette);
            // }
            // catch(e){
            //     console.log(e);
            // }

            let uploadedLogos = await getLogos();
            const len = uploadedLogos ? uploadedLogos.length : 0;
            if (len === 0) {   
                uploadedLogos = [{
                    id: 0,
                    source: { uri: imageUri },
                    color: 'red'
                }];
            } 
            else {
                uploadedLogos.push({
                    id: len,
                    source: { uri: imageUri },
                    color: 'red'
                });
            }
            AsyncStorage.setItem('uploadedLogos', JSON.stringify(uploadedLogos));
            setUploadedLogos(uploadedLogos);
        }
    };

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button title="Add logo" onPress={pickImage} />

        </View>
    );
}


import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    grid: {
        margin: 10,

    },
    logo: {
        height: Dimensions.get('window').width / 5,
        width: Dimensions.get('window').width / 5,
    },
    item: {
        padding: 20,
    },
    button: {
        alignItems: "center",
        justifyContent: "center",
        margin: 10,
        padding: 10,
        borderRadius: 4,
        backgroundColor: "#FF6B6C",
    },
    deleteLogoBtn: {
        position: 'absolute',
        top: `10%`,
        right: `10%`,
        zIndex: 1,
    }
});
