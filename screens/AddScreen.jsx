import React,{ useEffect, useState } from 'react';
import {View,  TouchableOpacity, ScrollView, Text, FlatList,
 Image,PermissionsAndroid,Platform, Dimensions, TextInput, Alert,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import Loadings from '../components/Loadings';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useSelector } from 'react-redux';



const {width} = Dimensions.get("screen")

const AddScreen = () => {
  const navigation = useNavigation()
  const {userData} = useSelector((state)=>state.user)
    const [selectedImages, setSelectedImages] = useState([]);
    const [isLoading,setIsLoading] = useState(true)
    const [steps,setSteps] = useState(0)
    const [postInfo,setPostInfo] = useState({
      comments:[],
      desc:"",
      hideLikes:false,
      likes:[],
      offComments:false,
      picture:"",
      title:""
    })
    const [uploading,setUploading] = useState(false)

    useEffect(()=>{
        askPermission();
    },[])
    const getPhotos = () => {
        CameraRoll.getPhotos({
          first: 2000,
          assetType: 'Photos',
        })
          .then(res => {
            setIsLoading(false)
            setSelectedImages(res.edges);
          })
          .catch(error => {
            console.log(error);
          });
      };
    

    const askPermission = async () => {
        if (Platform.OS === 'android') {
          const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
              title: 'Permission Explanation',
              message: 'ReactNativeForYou would like to access your photos!',
            },
          );
          if (result !== 'granted') {
            console.log('Access to pictures was denied');
            return;
          } else {
            getPhotos();
          }
        } else {
          getPhotos();
        }
      };

      handleCreatePost = async () => {
        let downloadURL
        const image  = postInfo?.picture;
        const filename = image.substring(image.lastIndexOf('/') + 1);
        const uploadimage = Platform.OS === 'ios' ? image.replace('file://', '') : image;
        setUploading(true);
        const reference = storage().ref(filename);
        const task = storage()
          .ref(filename)
          .putFile(uploadimage);
        try {
          await task;
          downloadURL = await reference.getDownloadURL();
          setPostInfo({...postInfo,picture:downloadURL})
        } catch (e) {
          console.error(e);
        }
        const docRef = firestore().collection("posts").doc()
        const docData = {...postInfo, id:docRef.id,creator:userData?.id,picture:downloadURL}
        await docRef.set(docData)
        console.log(postInfo)
        setUploading(false);
        Alert.alert(
          'Success!',
          'Your post has been Added!'
        );
        setPostInfo({
          ...postInfo,desc:"",picture:""
        })
        navigation.navigate("Home")

      }

      handleCanel = () => {
        setPostInfo({
          ...postInfo,picture:"",desc:""
        })
        navigation.navigate("Home")
      }
      if(isLoading){
        return <Loadings />
      }
    return (
        <View className='flex-1 bg-black' >
          <View className='flex-row items-center justify-between m-4' >
            <View className='flex-row items-center space-x-10' >
                {steps === 0 ? (
                  <TouchableOpacity onPress={()=>navigation.navigate('Home')} >
                    <FontAwesome5
                      name="times"
                      size={30}
                      color="white"
                    />
                </TouchableOpacity>
                ):(
                  <TouchableOpacity onPress={()=>setSteps(0)} >
                    <FontAwesome5
                      name="arrow-left"
                      size={30}
                      color="white"
                    />
                </TouchableOpacity>
                )}
                <Text className='text-xl text-white' >New Post</Text>
            </View>
            {steps === 0 && (
              <TouchableOpacity onPress={()=>setSteps(1)} >
                <FontAwesome5
                  name="arrow-right"
                  size={30}
                  color="#00CCBB"
                />
              </TouchableOpacity>
            ) }
          </View>
          {steps === 0 ? (
            <FlatList
            data={selectedImages}
            numColumns={3}
            renderItem={({item}) => (
            <TouchableOpacity style={{width:width*0.33, height:150}} onPress={()=>{
              setPostInfo({...postInfo,picture:item.node.image.uri})
              setSteps(1)
            }} >
              <Image
                className='w-full h-full'
                source={{uri: item.node.image.uri}}
              />
            </TouchableOpacity>
            )}
        />
        ):(
          <View className='mx-4' >
            <Text>Enter a text about your Post...</Text>
            <TextInput placeholder='text...' multiline = {true} numberOfLines = {5} className='border-[1px] border-white px-3 py-0 my-4' onChangeText={(value)=>setPostInfo({...postInfo,desc:value})} />
            <View className='flex-row items-center justify-between space-x-4' >
              <TouchableOpacity style={{width:width * 0.4}} className='border-red-600 border-[1px] py-4 rounded-full flex-row items-center justify-center' onPress={handleCanel} >
                <Text className='text-white' >Cancel Post</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{width:width * 0.4}} className='border-white border-[1px] py-4 rounded-full flex-row items-center justify-center' onPress={handleCreatePost} >
                <Text className='text-white'>Add Post</Text>
              </TouchableOpacity>
            </View>
            {uploading && (
              <Text className='text-lg text-white' >Please Wait...</Text>
            )}
          </View>
        )}
      </View>
    );
}


export default AddScreen;
