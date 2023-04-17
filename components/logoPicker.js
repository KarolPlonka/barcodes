import React from 'react';
import {
    View,
    FlatList,
    Image,
    TouchableOpacity,
    Dimensions,
} from 'react-native';

const logosUri = "../assets/logos/";

export const logos = [
    {uri: require(logosUri + "biedronka.png"), color: 'red'},
    {uri: require(logosUri + "orlen.png"), color: 'red'},
    {uri: require(logosUri + "bp.png"), color: 'red'},
    {uri: require(logosUri + "carrefour.png"), color: 'red'},
    {uri: require(logosUri + "lidl.png"), color: 'red'},
    {uri: require(logosUri + "swastika.png"), color: 'red'},
    {uri: require(logosUri + "zabka.png"), color: 'red'},
]

export default LogoPicker = ({onLogoPress}) => {

    renderLogo = ({item}) => {
        return(
            <TouchableOpacity onPress={() => onLogoPress(item)} style={styles.item}>
                <Image source={item.uri} style={styles.logo} resizeMode={"contain"} />
            </TouchableOpacity>
        )
    }

    return (
        <FlatList
            data={logos}
            numColumns={3}
            keyExtractor={(item) => item.uri}
            renderItem={renderLogo}
            contentContainerStyle={styles.grid}
        >
        </FlatList>
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
    }
});
