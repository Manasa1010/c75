import * as React from "react";
import {View,Text,TouchableOpacity,FlatList,StyleSheet,TextInput} from "react-native";
import firebase from "firebase"
import db from "../config"


export default class LoginScreen extends React.Component{
    constructor(){
        super();
        this.state={
            email:"",
            password:""
        }
    }
    login=async(email,password)=>{
        if(email && password){
            try {    var response=await firebase.auth().signInWithEmailAndPassword(email,password)
            if(response){
                this.props.navigation.navigate("Transaction")
            }}
            catch(error){
                Alert.alert(error.message)
            }
            
        }
       
    }

    render(){
        return(
            <View><Text>Login</Text>
            <TextInput placeholder="email"
             style={styles.inputBox}
            keyboardType={"email-address"}
            onChangeText={(text)=>{
               this.setState({
                   email:text
               })
        }}
            value={this.state.email}
            />
            <TextInput placeholder="passWord"
            style={styles.inputBox}
            secureTextEntry={true}
            onChangeText={(text)=>{
                this.setState({
                    password:text
                })
            }}
            value={this.state.password}
            />
            <TouchableOpacity  style={styles.button} 
            onPress={()=>{
                this.login(this.state.email,this.state.password)
            }}
            >
               <Text  style={styles.text}>login</Text>
            </TouchableOpacity>
             </View>
        )
    }
}
var styles=StyleSheet.create({
    inputBox:{
        width:"70%",
        height:50,
        borderWidth:2,
        alignItems:"center",
        marginTop:10
    },
    button:{
        width:"20%",
        height:50,
        borderWidth:2,
        alignItems:"center",
        backgroundColor:"pink",
        justifyContent:"center",
        marginTop:10
    },text:{
        fontSize:15,
        fontWeight:"bold",
       
    }
})