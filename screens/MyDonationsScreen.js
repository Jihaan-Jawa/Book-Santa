import React ,{Component} from 'react'
import {View, Text,TouchableOpacity,ScrollView,FlatList,StyleSheet} from 'react-native';
import {Card,Icon,ListItem} from 'react-native-elements'
import MyHeader from '../Components/MyHeader.js'
import firebase from 'firebase';
import db from '../config.js'

export default class MyDonationsScreen extends Component {
   constructor(){
     super()
     this.state = {
       donorId : firebase.auth().currentUser.email,
       donorName : "",
       allDonations : []
     }
     this.requestRef= null
   }

   static navigationOptions = { header: null };

   getDonorDetails=(donorId)=>{
     db.collection("users").where("emailId","==", donorId).get()
     .then((snapshot)=>{
       snapshot.forEach((doc) => {
         this.setState({
           "donorName" : doc.data().firstName + " " + doc.data().lastName
         })
       });
     })
   }

   getAllDonations =()=>{
     this.requestRef = db.collection("allDonations").where("donorId" ,'==', this.state.donorId)
     .onSnapshot((snapshot)=>{
       var allDonations = []
       snapshot.docs.map((doc) =>{
         var donation = doc.data()
         donation["docId"] = doc.id
         allDonations.push(donation)
       });
       this.setState({
         allDonations : allDonations
       });
     })
   }

   sendBook=(bookDetails)=>{
     if(bookDetails.request_status === "Book Sent"){
       var requestStatus = "Donor Interested"
       db.collection("allDonations").doc(bookDetails.docId).update({
         "requestStatus" : "Donor Interested"
       })
       this.sendNotification(bookDetails,requestStatus)
     }
     else{
       var requestStatus = "Book Sent"
       db.collection("allDonations").doc(bookDetails.docId).update({
         "requestStatus" : "Book Sent"
       })
       this.sendNotification(bookDetails,requestStatus)
     }
   }

   sendNotification=(bookDetails,requestStatus)=>{
     var requestId = bookDetails.request_id
     var donorId = bookDetails.donor_id
     db.collection("all_notifications")
     .where("requestId","==", requestId)
     .where("donorId","==",donorId)
     .get()
     .then((snapshot)=>{
       snapshot.forEach((doc) => {
         var message = ""
         if(requestStatus === "Book Sent"){
           message = this.state.donorName + " sent you book"
         }else{
            message =  this.state.donorName  + " has shown interest in donating the book"
         }
         db.collection("allNotifications").doc(doc.id).update({
           "message": message,
           "notificationStatus" : "unread",
           "date"                : firebase.firestore.FieldValue.serverTimestamp()
         })
       });
     })
   }

   keyExtractor = (item, index) => index.toString()

   renderItem = ( {item, i} ) =>(
     <ListItem
     bottomDivider>
         <ListItem.Content>
       <ListItem.Title>{item.book_name}</ListItem.Title>
       <ListItem.Subtitle>
       {"Requested By : " + item.requested_by +"\nStatus : " + item.requestStatus}
       </ListItem.Subtitle>
           <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor : item.requestStatus === "Book Sent" ? "green" : "#ff5722"
              }
            ]}
            onPress = {()=>{
              this.sendBook(item)
            }}
           >
             <Text style={{color:'#ffff'}}>{
               item.requestStatus === "Book Sent" ? "Book Sent" : "Send Book"
             }</Text>
           </TouchableOpacity>
           </ListItem.Content>
       
     </ListItem>
   )


   componentDidMount(){
     this.getDonorDetails(this.state.donorId)
     this.getAllDonations()
   }

   componentWillUnmount(){
     this.requestRef();
   }

   render(){
     return(
       <View style={{flex:1}}>
         <MyHeader navigation={this.props.navigation} title="My Donations"/>
         <View style={{flex:1}}>
           {
             this.state.allDonations.length === 0
             ?(
               <View style={styles.subtitle}>
                 <Text style={{ fontSize: 20}}>List of all book Donations</Text>
               </View>
             )
             :(
               <FlatList
                 keyExtractor={this.keyExtractor}
                 data={this.state.allDonations}
                 renderItem={this.renderItem}
               />
             )
           }
         </View>
       </View>
     )
   }
   }


const styles = StyleSheet.create({
  button:{
    width:100,
    height:30,
    justifyContent:'center',
    alignItems:'center',
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     },
    elevation : 16
  },
  subtitle :{
    flex:1,
    fontSize: 20,
    justifyContent:'center',
    alignItems:'center'
  }
})