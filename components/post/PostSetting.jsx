import React from 'react';
import {View, TouchableOpacity, Text, Dimensions, Alert} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore';

const {width, height} = Dimensions.get("screen")


const PostSetting = () => {
    const {postId} = useSelector((state)=>state.post)
    console.log(postId)

    const handleDelete = () => {
        firestore()
        .collection('posts')
        .doc(postId)
        .delete()
        .then(() => {
            Alert.alert("Post has been deleted")
        });
    }

    return (
        <View className='absolute top-10 bg-neutral-800 z-20 rounded-t-lg px-8 py-4 flex-col justify-center space-y-10' style={{height:height * 0.6,width:width}} >
            <TouchableOpacity className='flex-row items-center space-x-3' >
                <FontAwesome5
                    name="heart-broken"
                    size={23}
                    color="white"
                />
                <Text className='text-white' >Hide like count</Text>
            </TouchableOpacity>
            <TouchableOpacity className='flex-row items-center space-x-3' >
                <FontAwesome5
                    name="ban"
                    size={23}
                    color="white"
                />
                <Text className='text-white' >Turn off commenting</Text>
                
            </TouchableOpacity>
            <TouchableOpacity className='flex-row items-center space-x-3' >
                <FontAwesome5
                    name="pen"
                    size={23}
                    color="white"
                />
                <Text className='text-white' >Edit</Text> 
            </TouchableOpacity>
            <TouchableOpacity className='flex-row items-center space-x-3' onPress={handleDelete} >
                <FontAwesome5
                    name="trash"
                    size={23}
                    color="red"
                />
                <Text className='text-red-700' >Delete</Text>
            </TouchableOpacity>
        </View>
    );
}


export default PostSetting;
