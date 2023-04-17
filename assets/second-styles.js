import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    typePicker: {
        height: 150,
        width: "80%",
    },
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
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
        backgroundColor: "#D6D9E0",
        color: "#333333",
        fontFamily: "Helvetica",
    },
    barcodebox: {
        alignItems: "center",
        justifyContent: "center",
        width: "80%",
        height: "40%",
        overflow: "hidden",
        borderRadius: 50, //Changed from 4 to 50
        backgroundColor: "#1C3A77",
        marginBottom: 20,
        borderWidth: 2,
        borderColor: "#D6D9E0",
    },
    button: {
        alignItems: "center",
        justifyContent: "center",
        margin: 10,
        padding: 10,
        borderRadius: 4,
        backgroundColor: "#FF6B6C",
    },
    pressable: {
        backgroundColor: "#1C3A77",
        paddingHorizontal: 50,
        paddingVertical: 10,
        borderRadius: 50, //Changed from 4 to 50
        margin: 10,
        borderColor: "#D6D9E0",
        borderWidth: 2,
    },
    text: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 16,
        fontFamily: "Helvetica",
        textAlign: "center",
        alignSelf: "flex-start", //Added to experiment with unusual text alignments
    },
});

export default styles;