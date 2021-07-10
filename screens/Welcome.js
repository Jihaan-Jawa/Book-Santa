import React from 'react';
import { Text, View, FlatList, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Alert,Modal, ScrollView} from 'react-native';
import db from '../config';
import firebase from 'firebase'




export default class Welcome extends React.Component{
    constructor(){
        super();
        this.state={
            emailId:"",
            password:"",
            firstName:'',
            lastName:'',
            contact:'',
            address:'',
            confirmPassword:'',
            isModalVisible:false
        }
    }
    userSignUp=(emailId,password,confirmPassword)=>{
      if(Password!==confirmPassword){
        return Alert.alert('Password Does Not Match')
      }
      else{

      
      firebase.auth().createUserWithEmailAndPassword(emailId,password).then(()=>{
        db.collection('users').add({
          firstName:this.state.firstName,
          lastName:this.state.lastName,
        contact:this.state.contact,
      address:this.state.address,
    emailId:this.state.emailId,
  isRequestActive:false       })
        return Alert.alert('Succesfully logged in ','',[{text:'OK',onPress:()=>this.setState({
          isModalVisible:false
        })}])
      })
.catch((error)=>{
  return Alert.alert(error.message)
})
      }
        
    }
    

    userLogin=(emailId,password)=>{
      firebase.auth().sigInWithEmailAndPassword(emailId,password).then(()=>{
       this.props.navigation.navigate('DonateBooks')
      })
.catch((error)=>{
  return Alert.alert(error.message)
})
        
    }
    showModal=()=>{
      return(
        <Modal animationType='fade'  transparent={true} visible={this.state.isModalVisible }>
       
       <View style={styles.modalContainer}>
         <ScrollView style={{width:'100%'}}>
         <KeyboardAvoidingView style={styles.KeyboardAvoidingView}>
           <Text style={styles.modalTitle}>Registration</Text>
<TextInput style={styles.formTextInput}placeholder='firstName' maxLength={8} onChangeText={(text)=>{
  this.setState({
    firstName:text,

  })
}
}></TextInput>
<TextInput style={styles.formTextInput}placeholder='lastName' maxLength={8} onChangeText={(text)=>{
  this.setState({
    lastName:text,
    
  })
}
}></TextInput>
<TextInput style={styles.formTextInput}placeholder='contact' maxLength={10} keyboardType='numeric' onChangeText={(text)=>{
  this.setState({
   contact:text,
    
  })
}
}></TextInput><TextInput style={styles.formTextInput}placeholder='address' multiline={true} onChangeText={(text)=>{
  this.setState({
    address:text,
    
  })
}
}></TextInput>
<TextInput
              style={styles.formTextInput}
              placeholder="Enter Em@il id"
              onChangeText={text => {
                this.setState({
                 emailId: text
                });
              }}
              value={this.state.emailId}
              keyboardType='email-address'
            />
              <TextInput
              style={styles.formTextInput}
              placeholder="Enter Password"
              onChangeText={text => {
                this.setState({
                  password: text
                });
              }}
              value={this.state.password}
              secureTextEntry={true}
            />
            <TextInput
              style={styles.formTextInput}
              placeholder="confirmPassword"
              onChangeText={text => {
                this.setState({
                  confirmPassword: text
                });
              }}
              value={this.state.password}
              secureTextEntry={true}
            />
            <View style={styles.modalBackButton
            }>

              <TouchableOpacity style={styles.registerButton}  onPress={()=>{
                this.userSignUp(this.state.emailId,this.state.password,this.state.confirmPassword)
              }}><Text style={styles.registerButtonText}>Register</Text></TouchableOpacity>
            </View>
           </KeyboardAvoidingView>  
         </ScrollView>
       </View>

        </Modal>
      )
    }
    render(){
        return(
            <View style={styles.container}>
              {this.showModal()}
<View style={styles.profileContainer}>
    <Text style={styles.title}>BOOK SANTA :)</Text>


</View>
<View style={styles.buttonContainer}>

<TextInput
              style={styles.loginBox}
              placeholder="Enter Em@il id"
              onChangeText={text => {
                this.setState({
                 emailId: text
                });
              }}
              value={this.state.emailId}
              keyboardType='email-address'
            />
              <TextInput
              style={styles.loginBox}
              placeholder="Enter Password"
              onChangeText={text => {
                this.setState({
                  password: text
                });
              }}
              value={this.state.password}
              secureTextEntry={true}
            />
</View>

<TouchableOpacity style={[styles.button,{marginBottom:20 , marginTop:20}]}onPress={()=>{
    this.userLogin(this.state.emailId,this.state.password)
}}>
    <Text style={styles.buttonText}>Login</Text>
</TouchableOpacity>

<TouchableOpacity style={styles.button}onPress={()=>{
 this.setState({
   isModalVisible:true
 })
}}>
    <Text style={styles.buttonText}>SignUp</Text>
</TouchableOpacity>
            </View>


        )
    }
}



const styles = StyleSheet.create({
  container:{
   flex:1,
   backgroundColor:'#F8BE85',
   alignItems: 'center',
   justifyContent: 'center'
 },
 profileContainer:{
   flex:1,
   justifyContent:'center',
   alignItems:'center',
 },
 title :{
   fontSize:65,
   fontWeight:'300',
   paddingBottom:30,
   color : '#ff3d00'
 },
 loginBox:{
   width: 300,
   height: 40,
   borderBottomWidth: 1.5,
   borderColor : '#ff8a65',
   fontSize: 20,
   margin:10,
   paddingLeft:10
 },
 KeyboardAvoidingView:{
   flex:1,
   justifyContent:'center',
   alignItems:'center'
 },
 modalTitle :{
   justifyContent:'center',
   alignSelf:'center',
   fontSize:30,
   color:'#ff5722',
   margin:50
 },
 modalContainer:{
   flex:1,
   borderRadius:20,
   justifyContent:'center',
   alignItems:'center',
   backgroundColor:"#ffff",
   marginRight:30,
   marginLeft : 30,
   marginTop:80,
   marginBottom:80,
 },
 formTextInput:{
   width:"75%",
   height:35,
   alignSelf:'center',
   borderColor:'#ffab91',
   borderRadius:10,
   borderWidth:1,
   marginTop:20,
   padding:10
 },
 registerButton:{
   width:200,
   height:40,
   alignItems:'center',
   justifyContent:'center',
   borderWidth:1,
   borderRadius:10,
   marginTop:30
 },
 registerButtonText:{
   color:'#ff5722',
   fontSize:15,
   fontWeight:'bold'
 },
 cancelButton:{
   width:200,
   height:30,
   justifyContent:'center',
   alignItems:'center',
   marginTop:5,
 },

 button:{
   width:300,
   height:50,
   justifyContent:'center',
   alignItems:'center',
   borderRadius:25,
   backgroundColor:"#ff9800",
   shadowColor: "#000",
   shadowOffset: {
      width: 0,
      height: 8,
   },
   shadowOpacity: 0.30,
   shadowRadius: 10.32,
   elevation: 16,
   padding: 10
 },
 buttonText:{
   color:'#ffff',
   fontWeight:'200',
   fontSize:20
 }
})