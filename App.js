import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import { storeData } from "./utils/utils";

import ListScreen from "./screens/list";
import AddScreen from "./screens/add";
import SelectedScreen from "./screens/selected";
import LandingScreen from "./screens/LandingPage";

const Stack = createSharedElementStackNavigator();

const SlideUpTransition = ({ current, layouts }) => {
  const translateY = current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [layouts.screen.height, 0],
  });

  return {
    cardStyle: {
      transform: [{ translateY }],
    },
  };
};

export default function App() {
  storeData();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="ListScreen"
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: SlideUpTransition,
        }}
      >
        {/* <Stack.Screen
          name="LandingScreen"
          component={LandingScreen}
          screenOptions={{
            headerShown: false,
          }}
        /> */}
        <Stack.Screen
          name="ListScreen"
          component={ListScreen}
          options={{
            stackAnimation: "scale_from_center",
            stackPresentation: "modal",
          }}
        />
        <Stack.Screen
          name="AddScreen"
          component={AddScreen}
          options={{
            stackAnimation: "slide_from_bottom",
            stackPresentation: "modal",
          }}
        />
        <Stack.Screen
          name="SelectedScreen"
          component={SelectedScreen}
          screenOptions={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}