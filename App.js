import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {AppTabNavigator} from './Components/AppTabNavigator';
import Welcome from './screens/Welcome'
import {createSwitchNavigator,createAppContainer} from 'react-navigation'
import {AppDrawerNavigator } from "./Components/AppDrawerNavigator"
export default function App() {
  return (
   <AppContainer></AppContainer>
  );
}

const switchNavigator=createSwitchNavigator({
  Welcome:{screen:Welcome},
  Drawer:{screen:AppDrawerNavigator},

})
const AppContainer=createAppContainer(switchNavigator)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
