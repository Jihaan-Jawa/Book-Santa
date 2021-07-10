import React from 'react';
import { Text, View, FlatList, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Alert,Modal, ScrollView} from 'react-native';
import {Icon,Header,Badge}  from 'react-native-elements';
import ThemedListItem from 'react-native-elements/dist/list/ListItem';
import db from '../config'

export default class MyHeader extends React.Component{
    constructor(props){
        super(props);
        this.state= {
            value:"",


        }


    }

    getNumberOfUnreadNotifications(){
        db.collection("allNotifications").where("notificationStatus","==","unread").onSnapshot((snapshot)=>{
            var unreadNotifications=snapshot.doc.map((doc)=>doc.data())

            this.setState({
                value:unreadNotifications.length
            })

        })
    }
 componentDidMount(){
     this.getNumberOfUnreadNotifications()
 }
 bellIconWithBadge=()=>{
     return(
         <View>
             <Icon  name="bell" type="font-awesome" color="#696969"
             size={25}
             onPress={()=>{
                 this.props.navigation.navigate("Notifications")
             }}
             >

             </Icon>
             <Badge value={this.state.value}
             containerStyle={{position:"absolute",top:-4,right:-4}}>

             </Badge>
         </View>
     )
 }
    render(){
        return(
            <Header 
            leftComponent={<Icon name="bars" type="font-awesome" color="#696969"
            onPress={()=>this.props.navigation.toggleDrawer()}></Icon>}
            rightComponent={<this.bellIconWithBadge{...this.props}/>}
            centerComponent={{text:props.title,style:{color:'#90A5A9',fontSize:20,fontWeight:'bold'}}}backgroundColor='#EAF8FE'></Header>
        )
    }
}