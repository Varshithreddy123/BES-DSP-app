import React, { useEffect, useRef } from 'react';
import { View, Image, Text, Animated } from 'react-native';
import tw from 'twrnc';

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

const SplashScreen = ({ onAnimationComplete }: SplashScreenProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        onAnimationComplete();
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={tw`flex-1 bg-[#0052CC] justify-center items-center`}>
      {/* Background Circles */}
      <View
        style={tw`absolute top-0 right-0 w-64 h-64 rounded-full bg-[#2F6AAE] -mr-16 -mt-16`}
      />
      <View
        style={tw`absolute bottom-0 left-0 w-48 h-48 rounded-full bg-[#2F6AAE] -ml-12 -mb-12`}
      />

      <Animated.View style={{ opacity: fadeAnim, alignItems: "center" }}>
        {/* Logo with white container */}
        <View style={tw`mb-6 bg-white p-4 rounded-2xl shadow-lg`}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={tw`w-24 h-24`}
            resizeMode="contain"
          />
        </View>
        
        <Text style={tw`text-white text-xl text-center font-semibold`}>
          Welcome to BES-DSP
        </Text>
        <Text style={tw`text-white text-sm text-center mt-2 mb-2 font-semibold`}>
          Loading your experience...
        </Text>
      </Animated.View>
    </View>
  );
};

export default SplashScreen;