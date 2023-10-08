import React, {useState, useEffect} from 'react';
import {View, Text,TextInput, TouchableOpacity,Alert, ScrollView} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loadings from '../components/Loadings';


// import {createUserWithEmailAndPassword,  signInWithEmailAndPassword,updateProfile, signInWithPopup, GoogleAuthProvider} from "firebase/auth";
// import {auth, googleProvider} from '../config/firebase'
import { useNavigation } from '@react-navigation/native';
import Or from '../components/Or';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';

const AuthScreen = () => {
  const navigation = useNavigation()
  const [isSignIn,setIsSignIn] = useState(false)
  const [isLoading,setIsLoading] = useState(true)
  const [userInfo,setUserInfo] = useState({
    userName:"",
    email:"",
    password:"",
    confirmPassword:"",
    bio:"",
    followers:[],
    followings:[],
    posts:[],
    gender:"",
    picture:""
  })
  const {userData} = useSelector((state)=>state.user)

  useEffect(()=>{
    if(userData){
      navigation.navigate("Home")
    }else{
      setIsLoading(false)
    }
  },[userData])

  const handleSubmit = async () => {
    if(isSignIn){
      // Login Process 
      if(!userInfo.email || !userInfo.password){
        Alert.alert("Error","Miss informations!")
        return
      }
      setIsLoading(true)
      auth()
      .signInWithEmailAndPassword(userInfo.email, userInfo.password)
      .then((userCredential) => {
        console.log(userCredential)
        firestore()
        .collection('users')
        .where('email', '==', userCredential.user.email)
        .get()
        .then(querySnapshot => {
          if (!querySnapshot.empty) {
            // Access the first matching user document
            const userDocument = querySnapshot.docs[0];
            const userData = userDocument.data();
            const jsonUser = JSON.stringify(userData)
            AsyncStorage.setItem('profile',jsonUser).then(()=>{
              setIsLoading(false)
              navigation.navigate("Home")
              }).catch((err)=>{
                setIsLoading(false)
                console.log(err)
              })
            // You can now use the user data as needed
          } else {
            Alert.alert("Error",'User document not found')
            setIsLoading(false)
          }
        });
        
        
        
      })
      .catch((error) => {
        setIsLoading(false)
        Alert.alert("Error",error.message)
      });
    }else{
      // Register Process
      if(!userInfo.userName || !userInfo.email || !userInfo.password || !userInfo.confirmPassword){
        Alert.alert("Error","Miss informations!")
        return
      }
      if(userInfo.password !== userInfo.confirmPassword){
        Alert.alert("Error","Miss Password!")
        return
      }
      setIsLoading(true)
      auth().createUserWithEmailAndPassword(userInfo.email, userInfo.password)
      .then((userCredentials)=>{        
            userCredentials.user.updateProfile({
              displayName: userInfo.userName
            }).then(async ()=>{
              
              const docRef = firestore().collection('users').doc()
              const docData = { ...userInfo, id: docRef.id } // Add the ID to the document data
              await docRef.set(docData);
              console.log(docRef)
              setIsLoading(false)
              setIsSignIn(true)
            })
            .catch((err)=>{
              console.log(err)
              Alert.alert("Error",err.message)
            })
            
          
      })
      .catch(function(error) {
        Alert.alert(error.message);
      });

    }
  }

  const googleSign = async () => {
    try {
 
      await signInWithPopup(auth,googleProvider)
    
    } catch (error) {
      console.log(error)
    }
  }

  if(isLoading || userData){
    return <Loadings />
  }

    return (
        <SafeAreaView className='flex-1 bg-neutral-800 flex-row items-center justify-center' >
          <ScrollView  >
            <View className='w-10/12 my-8 mx-auto'>
              <View className='flex-row items-center space-x-2' >
                <Text className='text-lg' >Welcome to Instagram</Text>
                <FontAwesome5
                  name="instagram"
                  size={30}
                  color="white"
                />    
              </View>
              <Text className='underline text-xl' >{isSignIn ? "Login" : "Register"}</Text>
              <View className='flex-col space-y-4 my-4' >
                {!isSignIn && (
                  <TextInput 
                    placeholder='UserName...'
                    value={userInfo.userName}
                    onChangeText={(value)=>setUserInfo({...userInfo,userName:value})} 
                    className='w-full border-[1px] rounded-lg outline-none p-3 border-neutral-300'
                  />
                )}
                <TextInput 
                    placeholder='Email...'
                    value={userInfo.email}
                    onChangeText={(value)=>setUserInfo({...userInfo,email:value})} 
                    className='w-full border-[1px] rounded-lg outline-none p-3 border-neutral-300'
                    keyboardType='email-address'
                />
                <TextInput 
                    placeholder='Password...'
                    value={userInfo.password}
                    onChangeText={(value)=>setUserInfo({...userInfo,password:value})} 
                    className='w-full border-[1px] rounded-lg outline-none p-3 border-neutral-300'
                    secureTextEntry
                />
                {!isSignIn && (
                  <TextInput 
                    placeholder='Confirm Password...'
                    value={userInfo.confirmPassword}
                    onChangeText={(value)=>setUserInfo({...userInfo,confirmPassword:value})} 
                    className='w-full border-[1px] rounded-lg outline-none p-3 border-neutral-300'
                    secureTextEntry
                  />
                )}
              </View>
              <View className='flex-row space-x-2 items-center' >
                <Text>{isSignIn ? "Don't have account ?":"Already have account ?"}</Text>
                <Text className='underline' onPress={()=>setIsSignIn((prev)=>!prev)} >{isSignIn ? "Register" : "Login"}</Text>
              </View>
              <TouchableOpacity className='flex-row itms-center justify-center py-2 mt-4 bg-white rounded-lg' onPress={handleSubmit} >
                <Text className='text-neutral-800' >{isSignIn ? "Login" : "Register"}</Text>
              </TouchableOpacity>
              <Or />
              <TouchableOpacity className='flex-row itms-center justify-center py-2  bg-white rounded-lg' onPress={googleSign} >
                <View className='flex-row items-center space-x-2' >
                  <FontAwesome5
                    name="google"
                    size={15}
                    color="black"
                  />   
                  <Text className='text-neutral-800' >Sign In With Google</Text>  
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>

        </SafeAreaView>
    );
}


export default AuthScreen;
