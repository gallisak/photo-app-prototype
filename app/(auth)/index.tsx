import React from 'react';
import { View, ImageBackground, Image, useWindowDimensions, Text } from 'react-native';
import { useRouter } from 'expo-router';
import Button from '../../src/components/ui/Button';

export default function WelcomeScreen() {
    const router = useRouter();
    const { height } = useWindowDimensions();

    return (
        <View className="flex-1 bg-white justify-between">

            <ImageBackground
                source={require('../../assets/images/BgAuth.png')}
                style={{ height: height - 95 }}
                className="w-full relative"
                resizeMode="cover"
            >
                <View className="flex items-center h-[100%] p-6 pt-16">
                    <View />

                    <View className="flex-1 justify-center items-center flex-row space-x-3">
                        <Image
                            source={require('../../assets/images/logo.png')}
                            className="w-50 h-50"
                            resizeMode="contain"
                        />
                    </View>


                    <View className="flex-row items-center space-x-3 mt-auto mb-4 w-full px-2">
                        <Image
                            source={require('../../assets/images/avatar.png')}
                            className="w-10 h-10 rounded-full border border-black/10"
                        />
                        <View>
                            <Text className="text-black font-bold text-sm leading-tight">
                                Pawel Czerwinski
                            </Text>
                            <Text className="text-black/60 text-xs mt-0.5">
                                @pawel_czerwinski
                            </Text>
                        </View>
                    </View>

                </View>
            </ImageBackground>

            <View className="flex-row px-4 py-4 bg-white items-center h-24 border-t border-zinc-100">
                <View className="flex-1 mr-2">
                    <Button
                        title="Log in"
                        variant="outline"
                        onPress={() => router.push('/(auth)/login')}
                    />
                </View>
                <View className="flex-1 ml-2">
                    <Button
                        title="Register"
                        variant="primary"
                        onPress={() => router.push('/(auth)/register')}
                    />
                </View>
            </View>

        </View>
    );
}