import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';





const ProfileEditHeader = ({userInfo}) => {
    const navigation = useNavigation()

    const handleUpdateProfile = () => {
        firestore()
        .collection('users')
        // Filter results
        .where('id', '==', userInfo?.id)
        .get()
        .then(async (querySnapshot )=> {
            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0]
                userDoc.ref.update(userInfo).then(async ()=>{
                    console.log(userDoc)
                    const newDoc = userDoc?._data
                    
                    await AsyncStorage.setItem("profile",JSON.stringify(userInfo))
                    navigation.navigate("Profile")
                });
                
              } else {
                console.log('User does not exist.');
              }
        });
    }

    return (
        <View className='flex-row items-center justify-between m-4' >
                <View className='flex-row items-center space-x-8' >            
                    <TouchableOpacity onPress={()=>navigation.navigate("Profile")}>
                        <FontAwesome5
                            name="times"
                            size={30}
                            color="white"
                        />  
                    </TouchableOpacity>
                    <Text className='text-xl font-bold text-white' >Edit profile</Text>
                </View>
                    <TouchableOpacity onPress={handleUpdateProfile} >
                        <FontAwesome5
                        name="check"
                        size={30}
                        color="#00ccbb"
                        />
                    </TouchableOpacity>

            </View>
    );
}


export default ProfileEditHeader;
