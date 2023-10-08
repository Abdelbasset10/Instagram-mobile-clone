import React from 'react';
import {View, Image ,Text} from 'react-native';

const Storie = ({storie}) => {
    return (
        <View  >
            <Image source={storie?.img} className='w-16 h-16 rounded-full' />
            <Text className='text-white' >{storie?.name.length > 7 ? `${storie.name.slice(0,7)}...` : storie.name}</Text>

        </View>
    );
}


export default Storie;
