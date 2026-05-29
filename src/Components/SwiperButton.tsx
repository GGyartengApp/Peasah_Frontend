import React from 'react'
import { SwipeButton } from 'react-native-expo-swipe-button';
import { MaterialIcons } from '@expo/vector-icons';
import { Alert, View } from 'react-native'

const SwiperButtonComponent = () => {
  return (
     <View
        style={{
        width: "auto",
        backgroundColor: "none",
        justifyContent: 'center',
        flexDirection: 'column',
        paddingVertical: 3,
      }}
    >
      <SwipeButton 
        Icon={
          <MaterialIcons name="keyboard-arrow-right" size={50} color="white" />
        }
        iconContainerStyle={{ height: 50, width: 50, borderRadius: 25 }}
        onComplete={() => Alert.alert('Completed')}
        title="Swipe to Complete Registration"
        titleStyle={{color: "white", fontSize: 14, fontWeight: "bold"}}
        borderRadius={200}
        containerStyle={{ backgroundColor: 'gray' }}
        underlayTitle="Release to complete"
        underlayTitleStyle={{ color: 'white' }}
      />
    </View>
  )
}

export default SwiperButtonComponent