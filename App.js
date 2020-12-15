
import * as React from 'react';
import { StyleSheet, Text, View,Image } from 'react-native';
import {createAppContainer,createSwitchNavigator} from "react-navigation";
import {createBottomTabNavigator} from "react-navigation-tabs";
import TransactionScreen from "./Screens/TransactionScreen";
import SearchScreen from "./Screens/SearchScreen";
import LoginScreen from "./Screens/loginScreen";


export default class App extends React.Component {
  render(){
  return (
   <AppContainer/>
  );
}
}

/*const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});*/

var TabNavigator=createBottomTabNavigator({
  Transaction:{screen:TransactionScreen},
  Search:{screen:SearchScreen}
},
{
  defaultNavigationOptions:({navigation})=>({
    tabBarIcon:({})=>{
      const routeName=navigation.state.routeName;
      if(routeName==="Transaction"){
        return(
          <Image
          style={{width:40,height:40}}
          source={require("./assets/book.png")}/>
        )

        
      }else if(routeName==="Search"){
        return(
          <Image
          style={{width:40,height:40}}
          source={require("./assets/searchingbook.png")}/>
        )
      }
    }
  })
})
var SwitchNavigator=createSwitchNavigator({
  LoginScreen:{screen:LoginScreen},
  TabNavigator:{screen:TabNavigator}
})
var AppContainer=createAppContainer(SwitchNavigator);