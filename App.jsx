import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import AuthScreen from './screens/AuthScreen';
import SearchScreen from './screens/SearchScreen';
import AddScreen from './screens/AddScreen';
import WatchScreen from './screens/WatchScreen';
import ProfileScreen from './screens/ProfileScreen';
import CommentScreen from './screens/CommentScreen';
import ProfileEditScreen from './screens/ProfileEditScreen';
import UserPostsScreen from './screens/UserPostsScreen';


import AsyncStorage from '@react-native-async-storage/async-storage';
import { addUser } from './redux/features/userSlice';
import { useDispatch, useSelector } from 'react-redux';

const Tab = createBottomTabNavigator();




const App = () => {
  const dispatch = useDispatch()
  const {userData} = useSelector((state)=>state.user)
  console.log(userData)
  useEffect(()=>{
    AsyncStorage.getItem("profile").then((data)=>{
      const parsedUser = JSON.parse(data)
      dispatch(addUser(parsedUser))
    }).catch((err)=>{
      console.log(err)
    })
},[])
  return (
    <NavigationContainer>
        <Tab.Navigator 
          screenOptions={{
            headerShown:false,tabBarStyle:{
            backgroundColor:'black',
          },tabBarItemStyle:{
            color:'white',
            margin:5,
            borderRadius:10,
          }}}
          initialRouteName='Auth'>
          <Tab.Screen 
              name="Home"
              component={HomeScreen} 
              options={{
                tabBarIcon: () => (
                  <FontAwesome5
                  name="home"
                  size={23}
                  color="white"
                />
                ),
              }}
          />
            <Tab.Screen 
              name="Auth"
              component={AuthScreen} 
              options={{
                tabBarButton: () => null,
                tabBarVisible: false, // if you don't want to see the tab bar
              }}
          />
          
          <Tab.Screen 
              name="Search" 
              component={SearchScreen}
              options={{
                tabBarIcon: () => (
                  <FontAwesome5
                  name="search"
                  size={23}
                  color="white"
                />
                ),
              }}
          />
          <Tab.Screen 
              name="Add" 
              component={AddScreen}
              options={{
                tabBarIcon: () => (
                  <FontAwesome5
                  name="plus-square"
                  size={23}
                  color="white"
                />
                ),
              }}
          />
          <Tab.Screen 
              name="Watch" 
              component={WatchScreen}
              options={{
                tabBarIcon: () => (
                  <FontAwesome5
                  name="youtube-square"
                  size={23}
                  color="white"
                />
                ),
              }}
          />
          <Tab.Screen 
              name="Profile" 
              component={ProfileScreen}
              options={{
                tabBarIcon: () => (
                  <FontAwesome5
                  name="user-circle"
                  size={23}
                  color="white"
                />
                ),
              }}
          />
          <Tab.Screen 
              name="Comment" 
              component={CommentScreen}
              options={{
                presentation:"fullScreenModal",
                tabBarButton: () => null,
                tabBarVisible: false, // if you don't want to see the tab bar
              }}
          />
          <Tab.Screen 
              name="ProfileEdit" 
              component={ProfileEditScreen}
              options={{
                presentation:"fullScreenModal",
                tabBarButton: () => null,
                tabBarVisible: false, // if you don't want to see the tab bar
              }}
          />
          <Tab.Screen 
              name="UserPosts" 
              component={UserPostsScreen}
              options={{
                presentation:"fullScreenModal",
                tabBarButton: () => null,
                tabBarVisible: false, // if you don't want to see the tab bar
              }}
          />
        </Tab.Navigator>

    </NavigationContainer>
  );
}

const styles = StyleSheet.create({})

export default App;
