import React from 'react';
import {
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    Dimensions,
    Modal,
} from 'react-native';

const logosDir = "../assets/logos/";

export const logos = [
    {uri: require(logosDir + "biedronka.png"), color: 'red'},
    {uri: require(logosDir + "orlen.png"), color: 'red'},
    {uri: require(logosDir + "bp.png"), color: 'red'},
    {uri: require(logosDir + "carrefour.png"), color: 'red'},
    {uri: require(logosDir + "lidl.png"), color: 'red'},
    {uri: require(logosDir + "swastika.png"), color: 'red'},
    {uri: require(logosDir + "zabka.png"), color: 'red'},
]

export default LogoPicker = ({visible, onLogoPress, onNoLogoPress, backAction}) => {
    

    renderLogo = ({item}) => {
        return(
            <TouchableOpacity onPress={() => onLogoPress(item)} style={styles.item}>
                <Image source={item.uri} style={styles.logo} resizeMode={"contain"} />
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
                data={logos}
                numColumns={3}
                keyExtractor={(item) => item.uri}
                renderItem={renderLogo}
                contentContainerStyle={styles.grid}
            >
            </FlatList>

            <TouchableOpacity
                style={styles.button}
                onPress={() => onNoLogoPress()}
            >
                <Text>No logo</Text>
            </TouchableOpacity>
        </Modal>
    )
};


import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    grid: {
        alignItems: 'center'
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
});
