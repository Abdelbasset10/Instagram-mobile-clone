import React, {useState} from 'react';
import {View, Text, ScrollView, TextInput, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { posts } from '../data';
import PostSearch from '../components/PostSearch';
import firestore from '@react-native-firebase/firestore';
import UserSearch from '../components/search/UserSearch';



const SearchScreen = () => {
    const [name,setName] = useState("")
    const [users,setUsers] = useState([])

    const handleSearch = async () => {
        let results = []
        firestore()
  .collection('users').where('userName', '==', name)
  .get()
  .then((querySnapshot) => {
    console.log(querySnapshot.docs)
    querySnapshot.forEach((doc) => {
        // Access individual user document
        const userData = doc.data();
        
        results = [...results,userData]
    });
    setUsers(results)
    })
    .catch((error) => {
      console.error('Error getting users: ', error);
    });
    }
   
    console.log(users)
    return (
        <SafeAreaView className='flex-1 bg-black' >
            <ScrollView className='relative' >
                {users.length > 0 && (
                    <View className='absolute top-14 left-0 w-full bg-neutral-800 p-4 z-50 flex-col space-y-4' >
                        {users.map((user,index)=>(
                            <UserSearch user={user} key={index}  />
                        ))}
                    </View>
                )}
                <View className='flex-row items-center space-x-4 py-0 px-4 mx-4 mt-4 mb-2 bg-neutral-700 rounded-lg' >  
                    <TouchableOpacity onPress={handleSearch} >
                        <FontAwesome5
                            name="search"
                            size={15}
                            color="white"
                        />
                    </TouchableOpacity>
                    <TextInput placeholder='Search' className='py-1 flex-1' onChangeText={(value)=>{
                        setName(value)
                    }} />
                </View>
                <View className='flex-row flex-wrap' >
                    {posts.map((post,index)=>(
                        
                            <PostSearch post={post} key={index} />
                    ))}  

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}


export default SearchScreen;
