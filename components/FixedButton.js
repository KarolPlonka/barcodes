import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default FixedButton = ({ onPress, icon, position, customStyles = {} }) => {
    return(<>
        <TouchableOpacity
            onPress={onPress}
            style={[styles.button, customStyles, position]}
        >
            <Feather name={icon} size={30} color="white" />
        </TouchableOpacity>
    </>);
};

const styles = StyleSheet.create({
    button: {
        position: "absolute",
        backgroundColor: "#1C3A77",
        borderRadius: 50,
        width: 50,
        height: 50,
        alignItems: "center",
        justifyContent: "center", 
    }
})
