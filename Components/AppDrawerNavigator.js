import React from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {AppTabNavigator} from './AppTabNavigator'
import customSideBarMenu from "./CustomSideBarMenu"
import SettingsScreen from "../screens/SettingsScreen"
import MyDonationsScreen from "../screens/MyDonationsScreen"
import NotificationsScreen from "../screens/NotificationsScreen"

export const AppDrawerNavigator=createDrawerNavigator({
    Home:{screen:AppTabNavigator},
    Setting:{screen:SettingsScreen},
    MyDonations:{screens:MyDonationsScreen},
    Notifications:{screens:NotificationsScreen}


},
{
    contentComponent:customSideBarMenu
},
{
    initialRouteName:"Home"
}


)