import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    typePicker: {
        height: 150,
        width: "80%",
    },
    container: {
        flex: 1,
        backgroundColor: "#f0e6d2",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
    },
    input: {
        height: 40,
        marginTop: 10,
        borderWidth: 1,
        marginHorizontal: 10,
        padding: 10,
        width: "80%",
        borderRadius: 4,
        backgroundColor: "#FFFFFF",
    },
    barcodebox: {
        alignItems: "center",
        justifyContent: "center",
        width: "80%",
        height: "40%",
        overflow: "hidden",
        borderRadius: 4,
        backgroundColor: "#FFFFFF",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        marginBottom: 20,
        borderWidth: 2,
    },
    button: {
        alignItems: "center",
        justifyContent: "center",
        margin: 10,
        padding: 10,
        borderRadius: 4,
        backgroundColor: "#6e3b6e",
    },
    pressable: {
        backgroundColor: "#6e3b6e",
        paddingHorizontal: 50,
        paddingVertical: 10,
        borderRadius: 4,
        margin: 10,
    },
    text: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 16,
    },
});

export default styles;