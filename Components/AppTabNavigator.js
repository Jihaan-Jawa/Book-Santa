import BookDonateScreen from '../screens/BookDonateScreen'
import BooRequestScreen from '../screens/BookRequestScreen'
import React from 'react'
import {Image}from 'react-native'
import {createBottomTabNavigator} from 'react-navigation-tabs'


export const AppTabNavigator=createBottomTabNavigator({
    DonateBooks:{
        screen:BookDonateScreen,
        navigationOptions:{
            tabBarIcon:<Image source={require('../assets/bookdonate.jpg') }   style={{width:20, height:20}}></Image>,
            tabBarLabel:'Donate Books'
        }
    },

    DonateRequest:{
        screen:BookRequestScreen,
        navigationOptions:{
            tabBarIcon:<Image source={require('../assets/bookrequest.jpg') }   style={{width:20, height:20}}></Image>,
            tabBarLabel:'Donate Request'
        }
    }
})