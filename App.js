import MainScreen from "./screens/main";
import AddScreen from "./screens/second";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

const testBARCODES = [
  {
    title: 'BIEDRONKA',
    barcode: '978020137962',
  },
  {
    title: 'ORLEN',
    barcode: '123456789123',
  },
  {
    title: 'LIDL',
    barcode: '223456789123',
  },
];

// const currentValue = await AsyncStorage.getItem('barcodes')

    

// const jsonValue = JSON.stringify(value)
// await AsyncStorage.setItem('barcodes', jsonValue)

const storeData = async () => {
  try {
    const data = await AsyncStorage.getItem('barcodes')
    if(!data){
      await AsyncStorage.setItem('barcodes', JSON.stringify(testBARCODES))
      return;
    }
  } catch (e) {
    console.log(e)
  }
}


export default function App() {
  storeData();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="MainScreen"
          component={MainScreen}
        />
        <Stack.Screen 
          name="AddScreen"
          component={AddScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}