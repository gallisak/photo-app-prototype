import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/useAuthStore';
import CustomText from '../../components/CustomText';
import Button from '../../components/Button';
import { Undo2 } from 'lucide-react-native';

export default function LoginScreen() {
    const router = useRouter();
    const login = useAuthStore((state) => state.login);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (!email || !password) {
            alert('Please fill in all fields.');
            return;
        }

        login(email);

        router.replace('/(tabs)');
    };

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
                    Log In
                </CustomText>

            </View>

            <View className="mb-8">
                <TextInput
                    className="w-full h-14 border-2 border-black px-4 text-black font-semibold mb-4 tracking-wider"
                    placeholder="email@example.com"
                    placeholderTextColor="#a1a1aa"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <TextInput
                    className="w-full h-14 border-2 border-black px-4 text-black font-semibold tracking-wider"
                    placeholder="PASSWORD"
                    placeholderTextColor="#a1a1aa"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>

            <Button
                title="Log In"
                onPress={handleLogin}
                className="mb-4"
            />
        </View >
    );
}