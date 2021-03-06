import React from 'react';
import { Text, View, FlatList, StyleSheet, TextInput, TouchableOpacity,TouchableHighlight, KeyboardAvoidingView, Alert,Modal, ScrollView, AppState} from 'react-native';

import firebase from 'firebase'
import MyHeader from '../Components/MyHeader'
import db from "../config"
import {BookSearch} from "react-native-google-books"

export default class BookRequestScreen extends React.Component{
    constructor(){
        super();
        this.state={
            userId:firebase.auth().currentUser.email,
            bookName:"",
            reasonToRequest:"",
            isBookRequestActive:"",
            requestedBookName:"",
            bookStatus:"",
            requestId:"",
            userDocId:"",
            docId:"",
            ImageLink:"",
            dataSource:"",
            showFlatList:false,

            
        }
    }

    createUniqueId(){
        return Math.random().toString(36).substring(7)
        
    }
    addRequest=async(bookName,reasonToRequest)=>{
        var userId=this.state.userId
        var randomRequestId=this.createUniqueId()
        var books=await BookSearch.searchbook(bookName,"AIzaSyC8J2RIp-dY_3ugN_vh3yqj_XWvMJQibkU")
        db.collection('requestedBooks').add({
            userId:userId,
            bookName:bookName,
            reasonToRequest:reasonToRequest,
            requestId:randomRequestId,
            bookStatus:"requested",
            date:firebase.firestore.FieldValue.serverTimestamp(),
            "ImageLink":books.data[0].volumeInfo.imageLinks.smallThumbnail

        })
      await this.getBookRequest()
      db.collection("users").where("emailId","==",userId).get().then((snapshot)=>{
          snapshot.forEach((doc)=>{
        db.collection("users").doc(doc.id).update({
            isBookRequestActive:true
        })
          })
          
      })
        this.setState({
            bookName:'',
            reasonToRequest:""
        })
    
        return Alert.alert("Book requested successfully :)")
        
        
        

    }

    recievedBooks=(bookName)=>{
        var userId = this.state.userId
        var requestId =this.state.requestId
        db.collection("recievedBooks").add({
            userId:userId,
            bookName:bookName,
            requestId:requestId,
            bookStatus:"recieved"
        })

    }
 getIsBookRequestActive(){
     db.collection("users").where("emailId","==",this.state.userId).onSnapshot((snapshot)=>{
    snapshot.forEach((doc)=>{
        this.setState({

            isBookRequestActive:doc.data().isBookRequestActive,
            userDocId:doc.id,
            
        })
    })
    
     })
 }
async getBooksFromApi(bookName){
  this.setState({
    bookName:bookName
  })
  if(bookName.length>2){
    var books=await BookSearch.searchbook(bookName,"AIzaSyC8J2RIp-dY_3ugN_vh3yqj_XWvMJQibkU")
    this.setState({
      dataSource:books.data,showFlatlist:true
    })
  }
}
renderItem=({item,i})=>{
  return(
    <TouchableHighlight style={{alignItems:'center',
  backgroundColor:"#dddddd",
padding:10,
width:"90%"}}
activeOpacity={0.6}
underlayColor="#dddddd"
onPress={()=>{
  this.setState({
    showFlatList:false,
    bookName:item.volumeInfo.title
  })

}}
bottomDivider><Text>{item.volumeInfo.title}</Text></TouchableHighlight>
  )

}
  getBookRequest =()=>{
    // getting the requested book
  var bookRequest= async= db.collection('requestedBooks')
    .where('userId','==',this.state.userId)
    .get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        if(doc.data().bookStatus !== "received"){
          this.setState({
            requestId : doc.data().requestId,
            requestedBookName: doc.data().bookName,
            bookStatus:doc.data().bookStatus,
            docId     : doc.id
          })
        }
      })
  })}
  
  
  
  sendNotification=()=>{
    //to get the first name and last name
    db.collection('users').where('emailId','==',this.state.userId).get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        var name = doc.data().firstName
        var lastName = doc.data().lastName
  
        // to get the donor id and book nam
        db.collection('allNotifications').where('requestId','==',this.state.requestId).get()
        .then((snapshot)=>{
          snapshot.forEach((doc) => {
            var donorId  = doc.data().donorId
            var bookName =  doc.data().bookName
  
            //targert user id is the donor id to send notification to the user
            db.collection('allNotifications').add({
              "targetedUserId" : donorId,
              "message" : name +" " + lastName + " received the book " + bookName ,
              "notificationStatus" : "unread",
              "bookName" : bookName
            })
          })
        })
      })
    })
  }
  
  componentDidMount(){
    this.getBookRequest()
    this.getIsBookRequestActive()
  
  }
  
  updateBookRequestStatus=()=>{
    //updating the book status after receiving the book
    db.collection('requestedBooks').doc(this.state.docId)
    .update({
      bookStatus : 'recieved'
    })
  
    //getting the  doc id to update the users doc
    db.collection('users').where('emailId','==',this.state.userId).get()
    .then((snapshot)=>{
      snapshot.forEach((doc) => {
        //updating the doc
        db.collection('users').doc(doc.id).update({
          isBookRequestActive: false
        })
      })
    })
  
  
  }
  
  
    render(){
  
      if(this.state.IsBookRequestActive === true){
        return(
  
          // Status screen
  
          <View style = {{flex:1,justifyContent:'center'}}>
            <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
            <Text>Book Name</Text>
            <Text>{this.state.requestedBookName}</Text>
            </View>
            <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
            <Text> Book Status </Text>
  
            <Text>{this.state.bookStatus}</Text>
            </View>
  
            <TouchableOpacity style={{borderWidth:1,borderColor:'orange',backgroundColor:"orange",width:300,alignSelf:'center',alignItems:'center',height:30,marginTop:30}}
            onPress={()=>{
              this.sendNotification()
              this.updateBookRequestStatus();
              this.receivedBooks(this.state.requestedBookName)
            }}>
            <Text>I recieved the book </Text>
            </TouchableOpacity>
          </View>
        )
      }
      else
      {
      return(
        // Form screen
          <View style={{flex:1}}>
            <MyHeader title="Request Book" navigation ={this.props.navigation}/>
  
            <ScrollView>
              <KeyboardAvoidingView style={styles.keyBoardStyle}>
                <TextInput
                  style ={styles.formTextInput}
                  placeholder={"enter book name"}
                  onChangeText={(text)=>{
                      this.setState({
                          bookName:text
                      })
                  }}
                  value={this.state.bookName}
                />
                <TextInput
                  style ={[styles.formTextInput,{height:300}]}
                  multiline
                  numberOfLines ={8}
                  placeholder={"Why do you need the book"}
                  onChangeText ={(text)=>{
                      this.setState({
                          reasonToRequest:text
                      })
                  }}
                  value ={this.state.reasonToRequest}
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={()=>{ this.addRequest(this.state.bookName,this.state.reasonToRequest);
                  }}
                  >
                  <Text>Request</Text>
                </TouchableOpacity>
  
              </KeyboardAvoidingView>
              </ScrollView>
          </View>
      )
    }
  }
  }
  
  const styles = StyleSheet.create({
    keyBoardStyle : {
      flex:1,
      alignItems:'center',
      justifyContent:'center'
    },
    formTextInput:{
      width:"75%",
      height:35,
      alignSelf:'center',
      borderColor:'#ffab91',
      borderRadius:10,
      borderWidth:1,
      marginTop:20,
      padding:10,
    },
    button:{
      width:"75%",
      height:50,
      justifyContent:'center',
      alignItems:'center',
      borderRadius:10,
      backgroundColor:"#ff5722",
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 8,
      },
      shadowOpacity: 0.44,
      shadowRadius: 10.32,
      elevation: 16,
      marginTop:20
      },
    }
  )