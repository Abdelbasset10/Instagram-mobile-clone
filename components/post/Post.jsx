import { useNavigation } from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {View, Text, Image, TextInput, Dimensions, TouchableOpacity} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import PostSetting from './PostSetting';
import firestore from '@react-native-firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { updatePostId } from '../../redux/features/postSlice';


const {width, height} = Dimensions.get("screen")
const Post = ({post}) => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const {userData} = useSelector((state)=>state.user)
    const [showMore,setShowMore] = useState(false)
    const [showSetting,setShowSetting] = useState(false)
    const [user,setUser] = useState(null)
    const [isLiked,setIsLiked] = useState(post?.likes.includes(userData?.id))
    const [numLikes,setNumLikes] = useState(post?.likes.length)
    const [comment,setComment] = useState({
        text:"",
        userId:userData?.id
    })

    const goCommentsPage = () => {
        navigation.navigate("Comment",{
            id:post?.id
        })
    }

    const goProfile = () => {
        navigation.navigate("Profile",{
            id:post?.creator
        })
    }

    const handleLikeDislike = async () => {
        const getDoc = await firestore().collection('posts').doc(post.id).get()
        const docData = getDoc._data
        if(docData.likes.includes(userData?.id)){
            await getDoc.ref.update({
                likes:docData.likes.filter((f)=>f!==userData?.id)
                
            })
            setNumLikes((prev)=>prev - 1)
            setIsLiked(false)
        }else{
            await getDoc.ref.update({
                likes:[...docData.likes,userData?.id]
            })
            setIsLiked(true)
            setNumLikes((prev)=>prev + 1)
        }
    }

    const handleComment = async () => {
        const getDoc = await firestore().collection("posts").doc(post?.id).get()
        const docData = getDoc._data
        await getDoc.ref.update({
            comments:[...docData.comments,comment]
        })
        setComment({
            ...comment,text:""
        })
    }
 
    useEffect(()=>{
        const getUser = async () => {
            firestore()
            .collection('users')
            .where('id', '==', post?.creator)
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
        <View className='mb-4 relative' >
            <View className='flex-row items-center justify-between mb-2 mx-4' >
                <TouchableOpacity className='flex-row items-center space-x-2' onPress={goProfile} >
                    <Image source={user?.picture ? {uri:user.picture} : require('../../public/assets/avatar2.jpg')} className='w-8 h-8 rounded-full' />
                    <Text className='text-white text-md' >{user?.userName}</Text>
                </TouchableOpacity>
                {post.creator === userData?.id && (
                    <TouchableOpacity onPress={()=>{
                        dispatch(updatePostId(post?.id))
                        setShowSetting((prev)=>!prev)
                    }} >
                        <FontAwesome5
                            name="ellipsis-v"
                            size={23}
                            color="white"
                        />
                    </TouchableOpacity>
                )}
            </View>
            <Image source={{uri:post?.picture}} style={{width:width, height : height * 0.6}} />
            <View className='mx-4 mt-4 flex-row items-center justify-between' >
                <View className='flex-row items-center space-x-4' >
                    <TouchableOpacity onPress={handleLikeDislike} >
                        <FontAwesome5
                            name="heart"
                            size={23}
                            color={`${isLiked ? "red":"white"}`}
                        />
                    </TouchableOpacity>
                    <FontAwesome5
                        name="comment"
                        size={23}
                        color="white"
                    />
                    <FontAwesome5
                        name="share-alt"
                        size={23}
                        color="white"
                    />
                </View>
                <FontAwesome5
                    name="bookmark"
                    size={23}
                    color="white"
                />
            </View>
            <View className='mx-4 my-2 flex-col space-y-1' >
                <Text className='text-white text-md font-bold' >{numLikes} likes</Text>
                <Text>
                    <Text className='font-bold text-white' >
                        {post?.creator}
                    </Text>
                    <Text>{showMore ? ` ${post?.desc}` : ` ${post?.desc.slice(0,70)}`}... 
                        <Text className='text-white' onPress={()=>setShowMore((prev)=>!prev)} >{showMore ? "less" : "more"}</Text>
                    </Text>
                </Text>
                {post?.comments.length > 0 && (
                    <Text onPress={goCommentsPage}  >View all {post?.comments.length} comments</Text>
                )}
                <View className='flex-row items-center space-x-2 ' >
                    <Image source={require('../../public/assets/avatar5.jpg')} className='w-6 h-6 rounded-full' />
                    <TextInput placeholder='Add comment...' className=' flex-1  px-1 py-0' onChangeText={(value)=>setComment({...comment,text:value})} />
                    <TouchableOpacity onPress={handleComment} >
                        <Text className=' text-white' >Comment</Text>
                    </TouchableOpacity>
                </View>
                <Text>9 minutes ago . </Text>
            </View>
            {showSetting && (
                <PostSetting />
            )}
        </View>
    );
}



export default Post;
