import React from 'react';
import {View, Image, Text} from 'react-native';

const ProfileInfos = ({user}) => {
    console.log(user)
    return (
        <View  >
            <View className='mx-4 flex-row items-center justify-between space-x-10'>
                <Image source={user?.picture ? {uri:user.picture}:require('../../public/assets/ad2.jpg')} className='w-20 h-20 rounded-full' />
                <View className='flex-row items-center justify-between flex-1' >
                    <View className='flex-col items-center space-y-1 ' >
                        <Text className='text-white font-bold text-lg' >{user?.posts?.length}</Text>
                        <Text className='text-white text-md'>Posts</Text>
                    </View>
                    <View className='flex-col items-center space-y-1' >
                        <Text className='text-white font-bold text-lg'>{user?.followers?.length}</Text>
                        <Text className='text-white text-md'>Followers</Text>
                    </View>
                    <View className='flex-col items-center space-y-1' >
                        <Text className='text-white font-bold text-lg'>{user?.followings?.length}</Text>
                        <Text className='text-white text-md'>Followings</Text>
                    </View>
                </View>
            </View>
            <View className='mx-4' >
                <Text className='text-lg font-bold text-white' >{user?.userName}</Text>
                <Text className='text-white' >Full Stack Devoloper</Text>
                <Text className='text-white' >We can because... WE liVe</Text>
            </View>
        </View>
    );
}


export default ProfileInfos;
