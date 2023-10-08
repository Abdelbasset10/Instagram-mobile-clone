import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';




const ProfileHeader = ({user}) => {
    const navigation = useNavigation()
    const {userData} = useSelector((state)=>state.user)

    const handleLogOut = () => {
        auth()
        .signOut()
        .then(async () =>{
            await AsyncStorage.removeItem("profile")
            navigation.navigate("Auth")
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    return (
        <View className='flex-row items-center justify-between m-4' >
                <View className='flex-row items-center space-x-1' >
                    <Text className='text-xl font-bold text-white' >{user?.userName}</Text>
                    <View className='mt-1' >
                        <FontAwesome5
                            name="angle-down"
                            size={20}
                            color="white"
                        />  
                    </View>
                </View>
                {user?.id === userData?.id && (
                <TouchableOpacity onPress={handleLogOut} >
                    <Text className='text-white text-xl' >LogOut</Text>
                </TouchableOpacity>
                )}
                <View className='flex-row items-center space-x-8' >
                    <FontAwesome5
                    name="plus-square"
                    size={25}
                    color="white"
                    />
                    <FontAwesome5
                    name="bars"
                    size={25}
                    color="white"
                    />
                </View>
            </View>
    );
}


export default ProfileHeader;
