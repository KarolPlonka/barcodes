import { StyleSheet, StatusBar } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D6D9E0",
    marginTop: StatusBar.currentHeight || 0,
    fontFamily: "Coda-Latin-Bold",
  },
  typePicker: {
    height: 150,
    width: "80%",
    alignSelf: "center",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#1C3A77",
  },
  pressable: {
    backgroundColor: "#1C3A77",
    paddingHorizontal: 50,
    paddingVertical: 10,
    borderRadius: 20,
    margin: 10,
    borderWidth: 2,
    borderColor: "#D6D9E0",
  },
  item: {
    backgroundColor: "white",
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 18,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#1C3A77",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    fontFamily: "Actor",
  },
  title: {
    color: "#1C3A77",
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Coda-Latin-Bold",
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FF6B6C",
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
    fontWeight: "bold",
  },
  titleWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
