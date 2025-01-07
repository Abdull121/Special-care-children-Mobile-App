import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
const UserProfileLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="childProfile"
                options={{ headerShown: false }}
            />

        </Stack>
    )
}

export default UserProfileLayout