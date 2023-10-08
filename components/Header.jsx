import React from 'react';
import {View, Text} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';


const Header = () => {
    return (
        <View className='flex-row items-center justify-between mx-4 mb-4' >
                <Text className='text-white font-bold text-3xl' >Instagram</Text>
                <View className='flex-row items-center space-x-8' >
                    <FontAwesome5
                        name="heart"
                        size={30}
                        color="white"
                    />
                    <View className='relative' >
                        <FontAwesome5
                            name="facebook-messenger"
                            size={30}
                            color="white"
                        />
                        <View className='absolute -right-2 -top-2 w-5 h-5 bg-red-600 rounded-full flex-row items-center justify-center' >
                            <Text>6</Text>
                        </View>
                    </View>
                </View>
            </View>
    );
}


export default Header;
