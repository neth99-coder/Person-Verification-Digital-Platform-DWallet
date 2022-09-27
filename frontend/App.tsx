import React from "react";
import {
  NavigationContainer,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Onboarding from "./Components/CoinbaseClone/onboarding/Onboarding";
import CreateUsername from './Components/CoinbaseClone/onboarding/components/CreateUsername'
import SignIn from './Components/CoinbaseClone/onboarding/components/SignIn'
import Home from './Components/CoinbaseClone/onboarding/components/Home'

const Stack = createStackNavigator();

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding">
        <Stack.Screen
          name="Onboarding"
          component={Onboarding}
          options={{ headerShown: false }}
        />
      <Stack.Screen
          name="CreateUsername"
          component={CreateUsername}
          options={{ headerShown: true, headerStyle: {
            shadowColor:'transparent'
          }, headerTitle: '', headerBackTitle:'Back' }}
        />
        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={{ headerShown: true, headerStyle: {
            shadowColor: 'transparent'
          },headerTitle: '', headerBackTitle: 'Back' }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false, }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;