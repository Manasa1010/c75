import * as React from "react";
import {View ,Text,TouchableOpacity, StyleSheet,Image,TextInput} from "react-native";
import * as Permissions from "expo-permissions";
import {BarCodeScanner} from "expo-barcode-scanner";
import * as firebase from "firebase";
import db from "../config"

export default class TransactionScreen extends React.Component{
    constructor(){
        super();
        this.state={
            hasCameraPermission:null,
            scanned:false,
            scannedBookID:"",
            scannedStudentID:"",
            buttonState:"normal",
            transactionMessage:""
        }

    }
    getCameraPermission=async(id)=>{
        const {status}= await Permissions.askAsync(Permissions.CAMERA)
        this.setState({
            hasCameraPermission:status==="granted",
            buttonState:id,
            scanned:false
        })
    }
    handleBareCodeScanner=async({type,data})=>{
        const {buttonState}=this.state
        if(buttonState==="bookid"){
            this.setState({
                scanned:true,
                scannedBookID:data,
                buttonState:"normal"
            })
        }else if(buttonState==="studentid"){
            this.setState({
                scanned:true,
                scannedStudentID:data,
                buttonState:"normal"
            })
        }
      
    }
    handleTransaction=async()=>{
        var transactionMessage=null
         db.collection("books").doc(this.state.scannedBookID).get()
         .then((doc)=>{
         var book=doc.data();
         if(book.bookAvailability){
             this.initiateBookIssue();
             transactionMessage="bookIssued"
         }else{
             this.initiateBookReturn();
             transactionMessage="bookReturned";
         }
         }) 
         this.setState({
             transactionMessage:transactionMessage
         }) 
    }
    initiateBookIssue=async()=>{
        db.collection("transactions").add({
            studentID:this.state.scaanedStudentID,
            bookId:this.state.scannedBookID,
            date:firebase.firestore.Timestamp.now().toDate(),
            transactionType:"issue"
        })
        db.collection("books").doc(this.state.scannedBookID).update({
            bookAvailability:false
        })
        db.collection("student").doc(this.state.scannedStudentID).update({
            numberOfBooksIssued:firebase.firestore.FieldValue.increment(1)
        })
        this.setState({scannedStudentID:"",scannedBookID:""})
    }

    initiateBookReturn=async()=>{
        db.collection("transactions").add({
            studentID:this.state.scaanedStudentID,
            bookId:this.state.scannedBookID,
            date:firebase.firestore.Timestamp.now().toDate(),
            transactionType:"return"
        })
        db.collection("books").doc(this.state.scannedBookID).update({
            bookAvailability:true
        })
        db.collection("student").doc(this.state.scannedStudentID).update({
            numberOfBooksIssued:firebase.firestore.FieldValue.increment(-1)
        })
        this.setState({scannedStudentID:"",scannedBookID:""})
    }
    render(){
        const hasCameraPermission=this.state.hasCameraPermission;
        const scanned=this.state.scanned;
        const buttonState=this.state.buttonState;

        if(buttonState!=="normal" && hasCameraPermission===true){
           return(
                <BarCodeScanner 
                onBarCodeScanned={scanned?undefined:this.handleBareCodeScanner}
                style={StyleSheet.absoluteFillObject}
                ></BarCodeScanner>
           )
        }else if (buttonState==="normal"){
            return(
                <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                    <View>
                        <Image style={{width:200,height:200}} source={require("../assets/booklogo.jpg")}/>
                        <Text style={{textAlign:"center",fontSize:30}}></Text>
                    </View>
                    <View style={styles.inputView}>
                        <TextInput placeholder="book id"
                        value={this.state.scannedBookID}
                        style={styles.inputBox}/>
                        <TouchableOpacity 
                        onPress={()=>{
                            this.getCameraPermission("bookid")
                        }}
                        style={styles. scanButton}><Text>Scan</Text></TouchableOpacity>
                    </View>
                    <View style={styles.inputView}>
                        <TextInput placeholder="student id"
                         value={this.state.scannedStudentID}
                        style={styles.inputBox}/>
                        <TouchableOpacity 
                        onPress={()=>{
                            this.getCameraPermission("studentid")
                        }}
                        style={styles. scanButton}><Text>Scan</Text></TouchableOpacity>
                    </View>

                    <TouchableOpacity 
                        onPress={()=>{
                            this.handleTransaction
                        }}
                        style={styles. scanButton}><Text>Submit</Text></TouchableOpacity>
                </View>
                )
        }
       
    }
}
var styles=StyleSheet.create({
    inputBox:{
        width:100,
        height:100,
        borderWidth:2
    },
    scanButton:{
        width:50,
        height:50,
        borderWidth:2
    },inputView:{
        flexDirection:"row",
margin:20
    }
})