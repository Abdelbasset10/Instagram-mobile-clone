import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView, Dimensions, Alert} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileInfos from '../components/profile/ProfileInfos';
import Storie from '../components/Storie';
import { posts, stories } from '../data';
import PostSearch from '../components/PostSearch';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import Loadings from '../components/Loadings';

const ProfileScreen = ({route}) => {
    const {userData} = useSelector((state)=>state.user)
    const {id} = (route?.params || userData)
    const navigation = useNavigation()
    const [userInfo,setUserInfo] = useState(null)
    const [parsedUser,setParsedUser] = useState(null)
    const [isLoading,setIsLoading] = useState(true)

    useEffect(()=>{
            const getUser = async () => {
                firestore()
                .collection('users')
                // Filter results
                .where('id', '==', id)
                .get()
            .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                // User document found
                console.log("founded")
                const user = querySnapshot.docs[0]?._data
                setUserInfo(user)
                setIsLoading(false)
            } else {
                console.log("not founded")
                setUserInfo(userData)
                setIsLoading(false)
            }
            })
            .catch((error) => {
            console.log('Error retrieving user:', error);
            setIsLoading(false)
            });
};
        getUser()
    },[id])

    const handleFollow = async () => {
        const followingDocument = firestore().collection('users').doc(userData.id);
        const followingData = await followingDocument.get();
        const userfollowings = followingData._data.followings
        await followingDocument.update({
            followings:[...userfollowings,userInfo]
        })
        const followerDocument = firestore().collection('users').doc(userInfo.id);
        const followerData = await followerDocument.get();
        const userFollowers = followerData._data.followers
        await followerDocument.update({
            followers:[...userFollowers,userData]
        })  
        await followingDocument.get().then( async (data)=>{
            await AsyncStorage.setItem("profile",JSON.stringify(data._data))
        })
    }

    const handleUnFollow = async () => {
        const followingDocument = firestore().collection('users').doc(userData.id);
        const followingData = await followingDocument.get();
        const userfollowings = followingData._data.followings
        const updatedFollowing = userfollowings.filter((f)=>f.id !== userInfo.id)
        await followingDocument.update({
            followings:updatedFollowing
        })    
        const followerDocument = firestore().collection('users').doc(userInfo.id);
        const followerData = await followerDocument.get();
        const userFollowers = followerData._data.followers
        await followerDocument.update({
            followers:userFollowers.filter((f)=>f.id!==userData.id)
        }) 
        await followingDocument.get().then( async (data)=>{
            await AsyncStorage.setItem("profile",JSON.stringify(data._data))
        })
        
    }

    

    const isFollowing = userInfo?.followers?.find((f)=>f.id === userData.id)
    
    if(isLoading){
        return <Loadings />
    }

    if(!userInfo){
        return <View className='m-4' >
            <Text className='text-xl text-white' >There is No user with that Id..!</Text>
        </View>
    }
    return (
        <View className='flex-1 bg-black' >
            <ProfileHeader user={userInfo} />
            <ScrollView>
                <ProfileInfos user={userInfo} />
                <View className='flex-row items-center space-x-2 mx-4 my-4' >
                    {userInfo?.id === userData?.id && (
                        <TouchableOpacity className='flex-row items-center justify-center bg-neutral-800 flex-1 py-2 rounded-lg' onPress={()=>navigation.navigate("ProfileEdit")} >
                            <Text className='text-white' >Edit Profile</Text>
                        </TouchableOpacity>
                    ) }
                    <TouchableOpacity className='flex-row items-center justify-center bg-neutral-800 flex-1 py-2 rounded-lg' >
                        <Text className='text-white' >Share Profile</Text>
                    </TouchableOpacity>
                    {userInfo?.id !== userData?.id && (
                        isFollowing ? (
                            <TouchableOpacity className='flex-row items-center justify-center bg-neutral-800  py-2 rounded-lg px-2' onPress={handleUnFollow} >
                                <FontAwesome5
                                    name="user-times"
                                    size={15}
                                    color="white"
                                />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity className='flex-row items-center justify-center bg-neutral-800  py-2 rounded-lg px-2' onPress={handleFollow} >
                                <FontAwesome5
                                    name="user-plus"
                                    size={15}
                                    color="white"
                                />
                            </TouchableOpacity>
                        )
                    )}
                </View>
                <View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingLeft:15,
                            paddingRight:15,
                            paddingVertical:10,
                            display:'flex',
                            gap:10,
                        }}
                        className='h-32'
                    >
                        {stories.map((storie)=> (
                            <Storie storie={storie} key={storie.id} />
                        ))}
                    </ScrollView>
                </View>
                <View className='flex-row flex-wrap' >
                    {posts.map((post,index)=>(
                            <PostSearch post={post} key={index} />
                    ))}  
                </View>
            </ScrollView>
        </View>
    );
}


export default ProfileScreen;