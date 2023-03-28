import React, { useState, useEffect } from 'react';
import {
    FlatList,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    Dimensions,
    View,
    RefreshControl,
} from 'react-native';

import Barcode from '@kichiyaki/react-native-barcode-generator';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Item = ({ item, onPress, backgroundColor, textColor }) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, { backgroundColor }]}>
        <Text style={[styles.title, { color: textColor }]}>{item.title}</Text>
        <Barcode
            style={backgroundColor = { backgroundColor }}
            format="EAN13"
            value={item.barcode}
            text={item.barcode}
            maxWidth={Dimensions.get('window').width - 100}
        />
    </TouchableOpacity>
);

const getData = async () => {
    try {
        console.log("refreshed data")
        const jsonValue = await AsyncStorage.getItem('barcodes')
        return jsonValue !== null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.log(e)
    }
}

export default function MainScreen({ navigation, route }) {

    const [BARCODES, setBARCODES] = useState();
    
    const loadBarcodes = () => {
        const getDataAndSetState = async () => {
            const jsonData = await getData();
            if (jsonData) {
                setBARCODES(jsonData);
            }
        };
        getDataAndSetState();
    };
    
    useEffect(() => {loadBarcodes()}, []);


    const [selectedBarcode, setSelectedBarcode] = useState();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      loadBarcodes();
      setRefreshing(false);
    }, []);

    const renderItem = ({ item }) => {
        const backgroundColor = item.barcode === selectedBarcode ? '#6e3b6e' : '#f9c2ff';
        const color = item.barcode === selectedBarcode ? 'white' : 'black';

        return (
            <Item
                item={item}
                onPress={() => setSelectedBarcode(item.barcode)}
                backgroundColor={backgroundColor}
                textColor={color}
            />
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                data={BARCODES}
                renderItem={renderItem}
                keyExtractor={item => item.barcode}
                extraData={selectedBarcode}
            />
            <View style={{ position: 'absolute', bottom: 20, right: 20, alignSelf: 'flex-end' }}>
                <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddScreen")}>
                    <Text>+</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
    },
    item: {
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 32,
    },
    addButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: 60,
        borderRadius: 100,
        elevation: 3,
        backgroundColor: '#fff',
    }
});
