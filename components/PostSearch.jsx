import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {View, Image, Dimensions, TouchableOpacity} from 'react-native';

const {width,height} = Dimensions.get("screen")

const PostSearch = ({post}) => {
    const navigation = useNavigation()
    return (
        <TouchableOpacity style={{width:width * 0.33}} onPress={()=>navigation.navigate("UserPosts",{
            postId:post.id
        })} >
            <Image source={post?.postImg} className = 'w-full h-40' />
        </TouchableOpacity>
    );
}


export default PostSearch;
