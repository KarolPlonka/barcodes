import MainScreen from "./screens/main";
import AddScreen from "./screens/second";
import SelectedScreen from "./screens/selected";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

const testBARCODES = [
  { 
    title: 'BIEDRONKA',
    barcode: '978020137962',
    type: 'EAN13'
  },
  {
    title: 'ORLEN',
    barcode: '123456789123',
    type: 'EAN13'
  },
  {
    title: 'LIDL',
    barcode: '223456789123',
    type: 'EAN13'
  },
  {
    title: 'TESCO',
    barcode: '443456789123',
    type: 'EAN13'
  },
  {
    title: 'TESTCO',
    barcode: '553456789123',
    type: 'EAN13'
  },
  {
    title: 'SHEESH',
    barcode: '663456789123',
    type: 'EAN13'
  },
];

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
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="AddScreen"
          component={AddScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="SelectedScreen"
          component={SelectedScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// import React, { useState } from "react";
// import {
//   StyleSheet,
//   ListItem,
//   Input,
//   Stack,
//   Box,
//   Text,
//   Header,
// } from "react-native";
// import DraggableFlatList, {
//   ScaleDecorator,
// } from "react-native-draggable-flatlist";
// import { v4 as uuidv4 } from "uuid";

// export default function TodoList() {
//   const [data, setData] = useState([]);
//   const [text, setText] = useState("");
//   const handleTextInput = (input) => {
//     setText(input);
//   };

//   const handleAddTodo = () => {
//     const todo = text.trim();
//     if (!todo) return;
//     const key = uuidv4();
//     setData((prevData) => {
//       const newItem = {
//         key,
//         todo,
//         isCompleted: false,
//       };
//       return [newItem, ...prevData];
//     });
//     setText("");
//   };

//   const handleMarkAsCompleted = (key) => {
//     setData((prevData) => {
//       prevData.map((item) => {
//         if (item.key === key) {
//           item.isCompleted = !item.isCompleted;
//         }
//         return item;
//       });
//     });
//   };

//   const handleDeleteTodo = (key) => {
//     setData((prevData) => prevData.filter((item) => item.key !== key));
//   };

//   const renderItem = ({ item, drag, isActive }) => {
//     return (
//       <ScaleDecorator>
//         <ListItem
//           size="lg"
//           onLongPress={drag}
//           disabled={isActive}
//           background={isActive ? "gray300" : "white"}
//           onPress={() => handleMarkAsCompleted(item.key)}
//           rightIcon={
//             <Text
//               size="sm"
//               color="red500"
//               onPress={() => handleDeleteTodo(item.key)}
//             >
//               Clear
//             </Text>
//           }
//           textStyle={{
//             textDecorationLine: item.isCompleted ? "line-through" : "none",
//           }}
//         >
//           {item.todo}
//         </ListItem>
//       </ScaleDecorator>
//     );
//   };

//   return (
//     <>
//       <Header>Sortable Todo</Header>
//       <Stack horizontalSpace="md">
//         <Input
//           value={text}
//           outline
//           placeholder="Add todos"
//           onChangeText={handleTextInput}
//           onSubmitEditing={handleAddTodo}
//         />
//       </Stack>
//       {data && data.length === 0 && (
//         <Box space="6xl">
//           <Text>Start typing to add todos...</Text>
//         </Box>
//       )}
//       <DraggableFlatList
//         data={data}
//         onDragEnd={({ data }) => setData(data)}
//         keyExtractor={(item) => item.key}
//         renderItem={renderItem}
//       />
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "white",
//   },
// });

