import React, {useEffect, useState} from 'react';
import {View, Image, Text, TouchableOpacity} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';



const Comment = ({comment}) => {
    const {userData} = useSelector((state)=>state.user)
    const [user,setUser] = useState(null)

    const deleteComment = async () => {
        

    }

    useEffect(()=>{
        const getUser = async () => {
            firestore()
            .collection('users')
            .where('id', '==', comment?.userId)
            .get()
            .then(querySnapshot => {
                if(!querySnapshot.empty){
                    setUser(querySnapshot.docs[0]._data)
                }else{
                    console.log("no")
                }
            });
        }
        getUser()
    },[])
    return (
        <View className='my-4 flex-row space-x-2' >
            <Image source={user?.picture ? {uri:user.picture}: require('../public/assets/avatar3.jpg')} className='w-8 h-8 rounded-full mt-1' />
            <View className='flex-1 flex-col space-y-1' >
                <View className='flex-row space-x-2' >
                    <Text className='text-white' >{user?.userName}</Text>
                    <Text>27m</Text>
                    {userData?.id === user?.id && (
                        <TouchableOpacity>
                            <Text className='text-red-500' >Delete</Text>
                        </TouchableOpacity>
                    )}
                </View>
                {/* <Image source={require('../public/assets/post3.jpeg')} className='w-full h-48 object-contain rounded-lg' /> */}

                <Text>{comment?.text}</Text>
            </View>
            <View className='flex-col items-center space-y-1' >
                <FontAwesome5
                    name="heart"
                    size={23}
                    color="white"
                />
                <Text>2</Text>
            </View>

            
        </View>
    );
}


export default Comment;
