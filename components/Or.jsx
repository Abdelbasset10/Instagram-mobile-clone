import React from 'react';
import {View, Text, } from 'react-native';

const Or = () => {
    return (
        <View className='flex-row items-center justify-center space-x-2 my-4' >
            <View className='w-10 h-[1px] bg-white' ></View>
            <Text>Or</Text>
            <View className='w-10 h-[1px] bg-white'></View>
        </View>
    );
}

export default Or;
