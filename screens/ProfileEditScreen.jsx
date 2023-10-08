import React, {useState, useEffect} from 'react';
import {View, Image, Text, TextInput, TouchableOpacity,  Platform,Alert,
    PermissionsAndroid,} from 'react-native';
import ProfileEditHeader from '../components/profile/ProfileEditHeader';
import { useSelector } from 'react-redux';
import {
    launchCamera,
    launchImageLibrary
  } from 'react-native-image-picker';
  import { utils } from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';
import * as Progress from 'react-native-progress';


const ProfileEditScreen = () => {
    const {userData} = useSelector((state)=>state.user)
    const [userInfo,setUserInfo] = useState(null)
    const [uploading, setUploading] = useState(false);
    const [transferred, setTransferred] = useState(0);
    const requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.CAMERA,
              {
                title: 'Camera Permission',
                message: 'App needs camera permission',
              },
            );
            // If CAMERA Permission is granted
            return granted === PermissionsAndroid.RESULTS.GRANTED;
          } catch (err) {
            console.warn(err);
            return false;
          }
        } else return true;
      };
      const requestExternalWritePermission = async () => {
        if (Platform.OS === 'android') {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
              {
                title: 'External Storage Write Permission',
                message: 'App needs write permission',
              },
            );
            // If WRITE_EXTERNAL_STORAGE Permission is granted
            return granted === PermissionsAndroid.RESULTS.GRANTED;
          } catch (err) {
            console.warn(err);
            alert('Write permission err', err);
          }
          return false;
        } else return true;
      };

      const captureImage = async (type) => {
        let options = {
          mediaType: type,
          maxWidth: 300,
          maxHeight: 550,
          quality: 1,
          videoQuality: 'low',
          durationLimit: 30, //Video max duration in seconds
          saveToPhotos: true,
        };
        let isCameraPermitted = await requestCameraPermission();
        let isStoragePermitted = await requestExternalWritePermission();
        if (isCameraPermitted && isStoragePermitted) {
          launchCamera(options, (response) => {
            console.log('Response = ', response);
    
            if (response.didCancel) {
              Alert.alert('User cancelled camera picker');
              return;
            } else if (response.errorCode == 'camera_unavailable') {
              Alert.alert('Camera not available on device');
              return;
            } else if (response.errorCode == 'permission') {
              Alert.alert('Permission not satisfied');
              return;
            } else if (response.errorCode == 'others') {
              Alert.alert(response.errorMessage);
              return;
            }
            console.log('base64 -> ', response.base64);
            console.log('uri -> ', response.uri);
            console.log('width -> ', response.width);
            console.log('height -> ', response.height);
            console.log('fileSize -> ', response.fileSize);
            console.log('type -> ', response.type);
            console.log('fileName -> ', response.fileName);
            setFilePath(response);
          });
        }
      };
      
      const chooseFile = () => {
        let options = {
          mediaType: 'photo',
          quality:1
        };
        launchImageLibrary(options, async (response) => {
          console.log('Response = ', response.assets[0].uri);
    
          if (response.didCancel) {
            Alert.alert('User cancelled camera picker');
            return;
          } else if (response.errorCode == 'camera_unavailable') {
            Alert.alert('Camera not available on device');
            return;
          } else if (response.errorCode == 'permission') {
            Alert.alert('Permission not satisfied');
            return;
          } else if (response.errorCode == 'others') {
            Alert.alert(response.errorMessage);
            return;
          }
         
          setUserInfo({...userInfo,picture:response.assets[0].uri});
        });
      };

      const uploadImage = async () => {
        const image  = userInfo?.picture;
        const filename = image.substring(image.lastIndexOf('/') + 1);
        const uploadimage = Platform.OS === 'ios' ? image.replace('file://', '') : image;
        setUploading(true);
        setTransferred(0);
        const reference = storage().ref(filename);
        const task = storage()
          .ref(filename)
          .putFile(uploadimage);
        // set progress state
        task.on('state_changed', snapshot => {
          setTransferred(
            Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000
          );
        });
        try {
          await task;
          const downloadURL = await reference.getDownloadURL();
          setUserInfo({...userInfo,picture:downloadURL})
        } catch (e) {
          console.error(e);
        }
        setUploading(false);
        Alert.alert(
          'Photo uploaded!',
          'Your photo has been uploaded to Firebase Cloud Storage!'
        );

      };

    useEffect(()=>{
        setUserInfo(userData)
    },[])
    return (
        <View className='flex-1 bg-black' >
            <View>
                <ProfileEditHeader userInfo={userInfo} />
                <View>
                    <View className='flex-col items-center' >
                        <Image source={userInfo?.picture ? {uri:userInfo.picture}:require('../public/assets/avatar5.jpg')} className='w-20 h-20 rounded-full' />
                        <TouchableOpacity onPress={chooseFile} >
                            <Text className='text-white text-lg' >Edit Profile Image</Text>
                        </TouchableOpacity>
                        {uploading ? (
                          <View className='mt-4'>
                            <Progress.Bar progress={transferred} width={300} />
                          </View>
                        ) : (
                          <TouchableOpacity onPress={uploadImage}>
                            <Text className='text-white text-lg'>Upload image</Text>
                          </TouchableOpacity>
                        )}
                    </View>
                    <View className='mx-4 flex-col space-y-4' >
                        <View>
                            <Text className='text-lg' >Name</Text>
                            <TextInput  className=' border-white border-b-[1px]' onChangeText={(value)=>setUserInfo({...userInfo,userName:value})} />
                        </View>
                        <View className=' border-white border-b-[1px]'>
                            <Text className='text-lg'>Bio</Text>
                            <TextInput  onChangeText={(value)=>setUserInfo({...userInfo,bio:value})} />
                        </View>
                        <View className=' border-white border-b-[1px]'>
                            <Text className='text-lg'>Gender</Text>
                            <TextInput  onChangeText={(value)=>setUserInfo({...userInfo,gender:value})} />
                        </View>
                    </View>
                </View>
            </View>
            
        </View>
    );
}


export default ProfileEditScreen;
