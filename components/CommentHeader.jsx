import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';



const CommentHeader = () => {
    const navigation = useNavigation()
    return (
        <View className='m-4 flex-row items-center justify-between' >
            <View className='flex-row items-center space-x-10' >
                <TouchableOpacity onPress={()=>navigation.goBack()} >
                    <FontAwesome5
                        name="arrow-left"
                        size={23}
                        color="white"
                    />
                </TouchableOpacity>
                <Text className='text-2xl font-bold text-white' >Comments</Text>
            </View>
            <FontAwesome5
                name="share-alt"
                size={23}
                color="white"
            />
        </View>
    );
}


export default CommentHeader;
