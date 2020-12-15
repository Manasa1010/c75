import * as React from "react";
import {View ,Text,TouchableOpacity, StyleSheet,Image,TextInput,KeyboardAvoidingView,ToastAndroid, Alert} from "react-native";
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

        var transactionType=await this.checkBookEligibility();
          if(!transactionType){
                Alert.alert("thisBookDoesnotexsists")
                this.setState({
                scannedStudentID:"",
                scannedBookID:""
                
            })
        }
         else if(transactionType==="issue"){
             var isStudentEligible=await this.checkStudentEligibilityForIssue();
             if(isStudentEligible){
             this.initiateBookIssue();
             
             ToastAndroid.show("bookIssued",ToastAndroid.LONG);
             }   
         }else{
             var isStudentEligible= await this.checkStudentEligibilityForReturn();
             if(isStudentEligible){
             this.initiateBookReturn();
             
             ToastAndroid.show("bookReturned",ToastAndroid.LONG)
         }
         }
    }

    checkStudentEligibilityForIssue=async()=>{
        const studentRef=await db.collection("students").where("studentID","==",this.state.scannedStudentID).get()
        var isStudentEligible="";
        if(studentRef.docs.length===0){
            this.setState({
                scannedBookID:"",
                scannedStudentID:""
            })
            isStudentEligible=false 
            Alert.alert("studentID does not exists")   
            
        }else{
            studentRef.docs.map((doc)=>{
              var student=doc.data();
              if(student.numberOfBooksIssued<2){
                  isStudentEligible=true;
              }else{
                  isStudentEligible=false;
                  Alert.alert("The student is not eligible as he has already received 2 books");
                  this.setState({
                    scannedBookID:"",
                    scannedStudentID:""
                  })
              }
            })
        }
        return isStudentEligible;

        
    }
    checkBookEligibility=async()=>{
        const bookRef=await db.collection("books").where("bookID","==",this.state.scannedBookID).get()
        var transactionType="";
        if(bookRef.docs.length===0){
            transactionType=false;
        }else{
            bookRef.docs.map((doc)=>{
                var book=doc.data();
                if(book.bookAvailability){
                    transactionType="issue";
                }else{
                    transactionType="return";
                }
            })
        }
        return transactionType;
    }

    checkStudentEligibilityForReturn=async()=>{
        const transactionRef=await db.collection("Transaction").where("bookID","==",this.state.scannedBookID).limit(1).get()
        var isStudentEligible="";
        transactionRef.docs.map((doc)=>{
            var lastBookTransaction=doc.data();
            if(lastBookTransaction.studentID===this.state.scannedStudentID){
                isStudentEligible=true;
            }else{
            isStudentEligible=false;
            Alert.alert("This book was not issued by this student");
            this.setState({
                scannedBookID:"",
                scannedStudentID:""
              })
            }
        })
        return isStudentEligible;
    }

    initiateBookIssue=async()=>{
        db.collection("Transaction").add({
            studentID:this.state.scannedStudentID,
            bookID:this.state.scannedBookID,
            date:firebase.firestore.Timestamp.now().toDate(),
            transactionType:"issue"
        })
        db.collection("books").doc(this.state.scannedBookID).update({
            bookAvailability:false
        })
        db.collection("students").doc(this.state.scannedStudentID).update({
            numberOfBooksIssued:firebase.firestore.FieldValue.increment(1)
        })
        this.setState({scannedStudentID:"",scannedBookID:""})
    }

    initiateBookReturn=async()=>{
        db.collection("Transaction").add({
            studentID:this.state.scannedStudentID,
            bookID:this.state.scannedBookID,
            date:firebase.firestore.Timestamp.now().toDate(),
            transactionType:"return"
        })
        db.collection("books").doc(this.state.scannedBookID).update({
            bookAvailability:true
        })
        db.collection("students").doc(this.state.scannedStudentID).update({
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
                <KeyboardAvoidingView style={styles.container} behavior = "padding" enabled >
                    <View>
                        <Image style={{width:200,height:200}} source={require("../assets/booklogo.jpg")}/>
                        <Text style={{textAlign:"center",fontSize:30}}></Text>
                    </View>
                    <View style={styles.inputView}>
                        <TextInput 
                        onChangeText={text=>{
                            this.setState({
                                scannedBookID:text
                            })
                        }}
                         placeholder="book id"
                        value={this.state.scannedBookID}
                        style={styles.inputBox}/>
                        <TouchableOpacity 
                        onPress={()=>{
                            this.getCameraPermission("bookid")
                        }}
                        style={styles. scanButton}><Text>Scan</Text></TouchableOpacity>
                    </View>
                    <View style={styles.inputView}>
                        <TextInput 
                        onChangeText={(text)=>{
                            this.setState({
                                scannedStudentID:text
                            })
                        }}
                        placeholder="student id"
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
                            this.handleTransaction()
                        }}
                        style={styles. scanButton}><Text>Submit</Text></TouchableOpacity>
                </KeyboardAvoidingView>
                )
        }
       
    }
}
var styles=StyleSheet.create({
    inputBox:{
        width:150,
        height:50,
        borderWidth:2
    },
    scanButton:{
        width:150,
        height:50,
        borderWidth:2
    },inputView:{
        flexDirection:"row",
margin:20
    },
    container:{
        flex:1,justifyContent:"center",alignItems:"center"
    }
})