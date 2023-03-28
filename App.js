import MainScreen from "./screens/main";
import AddScreen from "./screens/second";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

const testBARCODES = [
  {
    id: 1,
    title: 'BIEDRONKA',
    barcode: '00000000033222T',
  },
  {
    id: 2,
    title: 'ORLEN',
    barcode: 'KURCZAKIZIEMANKI',
  },
  {
    id: 3,
    title: 'LIDL',
    barcode: '0000002021954Q',
  },
  {
    id: 4,
    title: 'LIDL',
    barcode: '0000002021954Q',
  },
  {
    id: 5,
    title: 'LIDL',
    barcode: '0000002021954Q',
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