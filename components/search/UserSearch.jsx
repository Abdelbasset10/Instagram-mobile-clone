import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';

const UserSearch = ({user}) => {
    const navigation = useNavigation()
    return (
        <TouchableOpacity className='pb-4 flex-row items-center space-x-4' onPress={()=>navigation.navigate("Profile",{
            id:user.id
        })}>
            <Image source={user.picture ? {uri:user.picture}:require('../../public/assets/ad2.jpg')} className='w-10 h-10 rounded-full' />
            <Text className='text-lg text-white' >{user?.userName}</Text>
        </TouchableOpacity>
    );
}


export default UserSearch;
