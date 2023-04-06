import React, { useState, useEffect } from "react";
import { Animated, Easing, View } from "react-native";
import LottieView from "lottie-react-native";

export default function SplashScreen() {
    const [lottieProgress] = useState(new Animated.Value(0));
  
    useEffect(() => {
      const timingAnimation = Animated.timing(lottieProgress, {
        toValue: 1,
        duration: 5000,
        easing: Easing.linear,
        useNativeDriver: true,
      });
  
      timingAnimation.start();
  
      return () => {
        timingAnimation.stop();
      };
    }, []);
  
    return (
      <View style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}>
        <LottieView
          progress={lottieProgress}
          loop={true}
          autoPlay
          speed={1}
          style={{
            alignSelf: "center",
            height: 200,
          }}
          source={require("../assets/testing2.json")}
          renderMode={"SOFTWARE"}
        />
      </View>
    );
  }
  