import { StyleSheet, StatusBar } from "react-native";

const styles = StyleSheet.create({
    typePicker: {
        height: 150,
        width: "80%",
      },
    container: {
      flex: 1,
      backgroundColor: "#f0e6d2",
      marginTop: StatusBar.currentHeight || 0,
    },
    pressable: {
        backgroundColor: "#6e3b6e",
        paddingHorizontal: 50,
        paddingVertical: 10,
        borderRadius: 4,
        margin: 10,
      },
    item: {
      backgroundColor: "white",
      padding: 20,
      marginVertical: 10,
      marginHorizontal: 18,
      borderRadius: 15,
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
  
  

  export default styles;