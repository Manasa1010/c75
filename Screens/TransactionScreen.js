import * as React from "react";
import {View ,Text,TouchableOpacity, StyleSheet} from "react-native";
import * as Permissions from "expo-permissions";
import {BarCodeScanner} from "expo-barcode-scanner";

export default class TransactionScreen extends React.Component{
    constructor(){
        super();
        this.state={
            hasCameraPermission:null,
            scanned:false,
            scannedBookID:"",
            scannedStudentID:"",
            buttonState:"normal"
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
                        <TextInput placeHolder="book id"
                        value={this.state.scannedBookID}
                        style={styles.inputBox}/>
                        <TouchableOpacity 
                        onPress={()=>{
                            this.getCameraPermission("bookid")
                        }}
                        style={styles. scanButton}><Text>Scan</Text></TouchableOpacity>
                    </View>
                    <View style={styles.inputView}>
                        <TextInput placeHolder="student id"
                         value={this.state.scannedStudentID}
                        style={styles.inputBox}/>
                        <TouchableOpacity 
                        onPress={()=>{
                            this.getCameraPermission("studentid")
                        }}
                        style={styles. scanButton}><Text>Scan</Text></TouchableOpacity>
                    </View>
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