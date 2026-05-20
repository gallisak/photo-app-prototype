import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import CustomText from '../../src/components/ui/CustomText';
import Button from '../../src/components/ui/Button';
import { Undo2 } from 'lucide-react-native';
import { useRegisterStep2 } from '../../src/features/auth/hooks/useRegisterStep2';

export default function RegisterStep2Screen() {
    const router = useRouter();
    const { name, setName, handleRegister } = useRegisterStep2();

    return (
        <View className="flex-1 bg-white justify-start px-6 pt-12">

            <TouchableOpacity
                onPress={() => router.back()}
                className="mt-4 mb-8 w-10 h-10 justify-center items-start"
            >
                <Undo2 size={28} color="#000000" />
            </TouchableOpacity>

            <View className="mb-10">
                <CustomText variant="title" className="text-black text-3xl font-black mb-2 text-left uppercase tracking-wider">
                    Register
                </CustomText>
            </View>

            <View className="mb-8">
                <TextInput
                    className="w-full h-14 border-2 border-black px-4 text-black font-semibold tracking-wider"
                    placeholder="NAME"
                    placeholderTextColor="#a1a1aa"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                />
            </View>

            <Button
                title="SING UP"
                onPress={handleRegister}
                className="mb-4"
            />

            <CustomText variant='subtitle'>
                By signing up, you agree to Photo’s <Text className='underline'>Terms of Service</Text> and <Text className='underline'>Privacy Policy</Text>.
            </CustomText>
        </View>
    );
}