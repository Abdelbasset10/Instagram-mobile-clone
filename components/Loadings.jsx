import React from 'react';
import {View, Text} from 'react-native';
import * as Progress from 'react-native-progress';
import { SafeAreaView } from 'react-native-safe-area-context';


const Loadings = () => {
    return (
        <SafeAreaView className="bg-neutral-800 flex-1 flex-row items-center justify-center" >
            <View>
                <Progress.Circle indeterminate={true} size={100} color='white' />
                <Text className='mt-4' >Please Wait..</Text>
            </View>
        </SafeAreaView>
    );
}


export default Loadings;
