import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {  onAuthStateChanged } from "firebase/auth";
import {auth} from '../config/firebase'
import Loadings from '../components/Loadings';
import Storie from '../components/Storie';
import { stories } from '../data';
import Post from '../components/post/Post';
import Header from '../components/Header';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../redux/features/userSlice';
import firestore from '@react-native-firebase/firestore';
import { fetchAllPosts } from '../redux/features/postSlice';





const HomeScreen =  () => {
    const dispatch = useDispatch()
    const {userData} = useSelector((state)=>state.user)
    const navigation = useNavigation()
    const {posts, isLoading,error} = useSelector((state)=>state.post)
    
    useEffect(()=>{
        if(!userData){
            navigation.navigate("Auth")
        }
    },[userData])

    useEffect(()=>{
        dispatch(fetchAllPosts())
    },[])
    
    if(isLoading){
        return <Loadings />
    }
    return (
        <SafeAreaView className='flex-1 bg-black' >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingTop:20,
                }}          
            >
            <Header />
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
                <View className='flex-col' >
                    {posts?.map((post)=>(
                        <Post post={post} key={post.id} />
                    ))}
                </View>

            </ScrollView>

        </SafeAreaView>
    );
}


export default HomeScreen;
