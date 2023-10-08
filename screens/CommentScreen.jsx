import React, {useEffect, useState} from 'react';
import {View, Text, Image, Dimensions, ScrollView, TextInput} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CommentHeader from '../components/CommentHeader';
import Comment from '../components/Comment';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';


const {width,height} = Dimensions.get("window")

const CommentScreen = ({route}) => {
    const {id} = route?.params
    const {userData} = useSelector((state)=>state.user)
    console.log(id)
    const [comments,setComments] = useState([])
    const [post,setPost] = useState(null)
    const [user,setUser] = useState(null)

    useEffect(()=>{
        const getComments = async () => {
            const getDoc = await firestore().collection("posts").doc(id).get()
            const docData = getDoc._data
            setComments(docData?.comments)
            setPost(docData)
            firestore()
            .collection('users')
            .where('id', '==', docData?.creator)
            .get()
            .then(querySnapshot => {
                if(!querySnapshot.empty){
                    setUser(querySnapshot.docs[0]._data)
                }else{
                    console.log("no")
                }
            });
        }
        getComments()
    },[])

    return (
        <SafeAreaView className='flex-1 bg-black ' >
            <CommentHeader />
            <ScrollView
                
            >
                <View className='flex-row items-start space-x-2 mx-4 border-b-[1px] border-neutral-500 pb-4' >
                    <Image source={user?.picture ? {uri:user.picture} : require('../public/assets/avatar2.jpg')} className='w-8 h-8 rounded-full mt-1' />
                    <View>
                        <View className='flex-row items-center space-x-2' >
                            <Text className=' text-white' >{user?.userName}</Text>
                            <Text>26m .</Text>
                            <Text>Edited</Text>
                        </View>
                        <Text style={{width:width * 0.85}} className='text-white' >{post?.desc}</Text>
                    </View>
                </View>
                
                <View className='mx-4'  >
                    {comments.map((comment,index)=>(
                        <Comment comment={comment} key={index} />
                    ))}
                </View>
            </ScrollView>
            <View className='absolute bottom-0 bg-neutral-800 h-20 flex-row items-center space-x-4 px-4 z-20' style={{width : width }} >
                <Image source={userData?.picture ? {uri:userData.picture} : require('../public/assets/avatar3.jpg')} className='w-8 h-8 rounded-full' />
                <TextInput placeholder={`Add comment for ${user?.userName}`} className=' flex-1' />
            </View>

        </SafeAreaView>
    );
}


export default CommentScreen;
