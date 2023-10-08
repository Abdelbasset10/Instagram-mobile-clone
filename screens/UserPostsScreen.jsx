import React from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Post from '../components/post/Post';
import { posts } from '../data';
import { useNavigation } from '@react-navigation/native';


const UserPostsScreen = ({route}) => {
    const {postId} = route.params
    console.log(postId)
    const navigation = useNavigation()
    return (
        <View className='flex-1 bg-black' >
            <View className='m-4 flex-row items-center space-x-10' >
                <TouchableOpacity onPress={()=>navigation.goBack()} >
                    <FontAwesome5
                    name="arrow-left"
                    size={30}
                    color="white"
                    />
                </TouchableOpacity>
                <Text className='font-bold text-2xl text-white' >User Posts</Text>
            </View>
            <ScrollView>
            <View className='flex-col' >
                    {posts.map((post)=>(
                        <Post post={post} key={post.id} />
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}


export default UserPostsScreen;
