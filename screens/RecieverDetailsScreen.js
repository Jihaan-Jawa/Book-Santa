import React from 'react';
import { Text, View, FlatList, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Alert,Modal, ScrollView} from 'react-native';
import db from '../config';
import firebase from 'firebase'
import {Header,Card,Icon} from "react-native-elements"


export default class RecieverDetailsScreen extends React.Component{
    constructor(props){
        super(props);
        this.state={
            userId:firebase.auth().currentUser.email,
            recieverId:this.props.navigation.getParam("details")['userId'],
            requestId:this.props.navigation.getParam("details")['requestId'],
            bookName:this.props.navigation.getParam("details")["bookName"],
            reasonToRequest:this.props.navigation.getParam("details"["reasonToRequest"]),
            recieverName:"",
            recieverContact:"",
            recieverAddress:"",
            receiverRequestDocId:"",


        }
    }
   getRecieverDetails(){
       db.collection("users").where("emailiD","==",this.state.recieverId).get().then((snapshot)=>{
           snapshot.forEach((doc)=>{
               this.setState({
                   recieverName:doc.data().firstName,
                   recieverContact:doc.data().contact,
                   recieverAddress:doc.data().address,
               })
               
           })
       })
       db.collection("requestedBooks").where("requestId","==",this.state.requestId)
.get.then((snapshot)=>{
    snapshot.forEach((doc)=>{
        this.setState({
            receiverRequestDocId:doc.id,

        })

    })
})  

 }

 updateBookStatus=()=>{
     db.collection("allDonations").add({
         bookName:this.state.bookName,
         requestId:this.state.requestId,
         requestedBy:this.state.recieverName,
         donorId:this.state.userId,
         requestStatus:"donor intrested"
     })
 }

 
 addNotification=()=>{
    var message = this.state.userName + " has shown interest in donating the book"
    db.collection("allNotifications").add({
      "targetedUserId"    : this.state.recieverId,
      "donorId"            : this.state.userId,
      "requestId"          : this.state.requestId,
      "bookName"           : this.state.bookName,
      "date"                : firebase.firestore.FieldValue.serverTimestamp(),
      "notificationStatus" : "unread",
      "message"             : message
    })
  }

   
 render(){
    return(
      <View style={styles.container}>
        <View style={{flex:0.1}}>
          <Header
            leftComponent ={<Icon name='arrow-left' type='feather' color='#696969'  onPress={() => this.props.navigation.goBack()}/>}
            centerComponent={{ text:"Donate Books", style: { color: '#90A5A9', fontSize:20,fontWeight:"bold", } }}
            backgroundColor = "#eaf8fe"
          />
        </View>
        <View style={{flex:0.3}}>
          <Card
              title={"Book Information"}
              titleStyle= {{fontSize : 20}}
            >
            <Card >
              <Text style={{fontWeight:'bold'}}>Name : {this.state.bookName}</Text>
            </Card>
            <Card>
              <Text style={{fontWeight:'bold'}}>Reason : {this.state.reason_for_requesting}</Text>
            </Card>
          </Card>
        </View>
        <View style={{flex:0.3}}>
          <Card
            title={"Reciever Information"}
            titleStyle= {{fontSize : 20}}
            >
            <Card>
              <Text style={{fontWeight:'bold'}}>Name: {this.state.recieverName}</Text>
            </Card>
            <Card>
              <Text style={{fontWeight:'bold'}}>Contact: {this.state.recieverContact}</Text>
            </Card>
            <Card>
              <Text style={{fontWeight:'bold'}}>Address: {this.state.recieverAddress}</Text>
            </Card>
          </Card>
        </View>
        <View style={styles.buttonContainer}>
          {
            this.state.recieverId !== this.state.userId
            ?(
              <TouchableOpacity
                  style={styles.button}
                  onPress={()=>{
                    this.updateBookStatus()
                    this.addNotification()
                    this.props.navigation.navigate('MyDonations')
                  }}>
                <Text>I want to Donate</Text>
              </TouchableOpacity>
            )
            : null
          }
        </View>
      </View>
    )
  }
}