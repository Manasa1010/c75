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
            scanData:"",
            buttonState:"normal"
        }

    }
    getCameraPermission=async()=>{
        const {status}= await Permissions.askAsync(Permissions.CAMERA)
        this.setState({
            hasCameraPermission:status==="granted",
            buttonState:"clicked"
        })
    }
    handleBareCodeScanner=async({type,data})=>{
        this.setState({
            scanned:true,
            scanData:data,
            buttonState:"normal"
        })
    }
    render(){
        const hasCameraPermission=this.state.hasCameraPermission;
        const scanned=this.state.scanned;
        const buttonState=this.state.buttonState;

        if(buttonState==="clicked" && hasCameraPermission===true){
           return(
                <BarCodeScanner 
                onBarCodeScanned={scanned?undefined:this.handleBareCodeScanner}
                style={StyleSheet.absoluteFillObject}
                ></BarCodeScanner>
           )
        }else if (buttonState==="normal"){
            return(
                <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                 <Text>{hasCameraPermission===true?this.state.scanData:"requestCameraPermission"}</Text>
                 <TouchableOpacity onPress={this.getCameraPermission}><Text>Scan QR Code</Text></TouchableOpacity>   
                </View>
                )
        }
       
    }
}