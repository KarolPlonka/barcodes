import MainScreen from "./screens/main";
import AddScreen from "./screens/second";
import SelectedScreen from "./screens/selected";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { storeData } from "./utils/utils";

const Stack = createNativeStackNavigator();

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

// import React from 'react';
// import MainScreen from "./screens/main";
// import AddScreen from "./screens/second";
// import SelectedScreen from "./screens/selected";

// import { TouchableOpacity } from "react-native";
// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { Feather } from '@expo/vector-icons';
// import { storeData } from "./utils/utils";

// const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();

// function MainTabs() {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ focused, color, size }) => {
//           let iconName;

//           if (route.name === 'MainScreen') {
//             iconName = focused ? 'home' : 'home';
//           } else if (route.name === 'AddScreen') {
//             iconName = focused ? 'plus' : 'plus';
//           }

//           return <Feather name={iconName} size={size} color={color} />;
//         },
//       })}
//       tabBarOptions={{
//         activeTintColor: 'tomato',
//         inactiveTintColor: 'gray',
//       }}
//     >
//       <Tab.Screen name="MainScreen" component={MainScreen} options={{headerShown: false}}/>
//       <Tab.Screen name="AddScreen" component={AddScreen} options={{headerShown: false}}/>
//     </Tab.Navigator>
//   );
// }



//   export default function App() {
//     storeData();
  
//     return (
//       <NavigationContainer>
//         <Stack.Navigator>
//           <Stack.Screen
//             name="MainTabs"
//             component={MainTabs}
//             options={{
//               headerShown: false,
//             }}
//           />
//           <Stack.Screen
//             name="SelectedScreen"
//             component={SelectedScreen}
//             options={{
//               headerShown: false,
//             }}
//           />
//         </Stack.Navigator>
//       </NavigationContainer>
//     );
//   }

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

