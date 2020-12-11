import * as React from "react";
import {View,Text,TouchableOpacity,FlatList,StyleSheet,TextInput} from "react-native";
import {ScrollView} from "react-native-gesture-handler"

import db from "./config"

export default class SearchScreen extends React.Component{
constructor(props){
    super(props)
    this.state={
        allTransaction:[],
        lastVisibleTransaction=null,
        search:""
    }
}
componentDidMount=async()=>{
    const query=await db.collection("Transaction").limit(10).get();
    query.docs.map(doc=>{
        this.setState({
            allTransaction:[],
            lastVisibleTransaction:doc
        })
    })
}
fetchMoreTransaction=async()=>{
    var text=this.state.search.toUpperCase()
    var enterText=text.split("")
    if(enterText[0].toUpperCase()==="B"){
      const query=await db.collection("Transaction").where("bookID","==",text).startAfter(this.state.lastVisibleTransaction).limit(10).get()
    query.docs.map(doc=>{
        this.setState({
            allTransaction:[...this.state.allTransaction,doc.data()],
            lastVisibleTransaction:doc
        })
    })
    }else  if(enterText[0].toUpperCase()==="S"){
        const query=await db.collection("Transaction").where("studentID","==",text).startAfter(this.state.lastVisibleTransaction).limit(10).get()
      query.docs.map(doc=>{
          this.setState({
              allTransaction:[...this.state.allTransaction,doc.data()],
              lastVisibleTransaction:doc
          })
      })
      }


}
searchTransaction=async(text)=>{
    var enterText=text.split("")
    if(enterText[0].toUpperCase()==="B"){
        const query=await db.collection("Transaction").where("bookID","==",text).get()
      query.docs.map(doc=>{
          this.setState({
              allTransaction:[...this.state.allTransaction,doc.data()],
              lastVisibleTransaction:doc
          })
      })
      }else  if(enterText[0].toUpperCase()==="S"){
          const query=await db.collection("Transaction").where("studentID","==",text).get()
        query.docs.map(doc=>{
            this.setState({
                allTransaction:[...this.state.allTransaction,doc.data()],
                lastVisibleTransaction:doc
            })
        })
        }
}
render(){
    return(
        <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
            <View style={{flexDirection:"row"}}>
            <TextInput style={styles.inputBox} onChangeText={text=>(
                this.setState({
                 search:text
                })
            )}></TextInput>
            <TouchableOpacity style={styles.button}></TouchableOpacity>

            </View>
           <FlatList
              data={this.state.allTransaction}
              renderItem={({item})=>{
              <View style={{borderBottomWidth:2}}>
                <Text>{"bookID: "+item.bookID}</Text>
                <Text>{"studentID: "+item.studentID}</Text>
                <Text>{"transactionType: "+item.transactionType}</Text>
                <Text>{"date: "+item.date.toDate()}</Text>

              </View>

              }}
              keyExtractor={(item,index)=>index.toString()}
              onEndReached={this.fetchMoreTransaction}
              onEndReachedThreshold={0.7}
           />
        </View>
    
        )

}
}
var styles=StyleSheet.create({
    inputBox:{
        width:150,
        height:50,
        borderWidth:2
    },
    button:{
        width:150,
        height:50,
        borderWidth:2
    }
})
