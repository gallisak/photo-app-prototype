import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomText from '../../src/components/ui/CustomText';
import Button from '../../src/components/ui/Button';
import { Undo2 } from 'lucide-react-native';
import { useRegister } from '../../src/features/auth/hooks/useRegister';
import { registerStep1Schema, RegisterStep1FormData } from '../../src/features/auth/schemas/registerSchema';

export default function RegisterScreen() {
    const router = useRouter();
    const { handleNext } = useRegister();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterStep1FormData>({
        resolver: zodResolver(registerStep1Schema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = (data: RegisterStep1FormData) => {
        handleNext(data.email, data.password);
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
                    Register
                </CustomText>
            </View>

            <View className="mb-8">
                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            className={`w-full h-14 border-2 px-4 text-black font-semibold tracking-wider ${errors.email ? 'border-red-500' : 'border-black'
                                }`}
                            placeholder="EMAIL"
                            placeholderTextColor="#a1a1aa"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    )}
                />
                {errors.email && (
                    <CustomText className="text-red-500 text-xs mt-1 mb-3 font-semibold">
                        {errors.email.message}
                    </CustomText>
                )}

                <View className="h-4" />

                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            className={`w-full h-14 border-2 px-4 text-black font-semibold tracking-wider ${errors.password ? 'border-red-500' : 'border-black'
                                }`}
                            placeholder="PASSWORD"
                            placeholderTextColor="#a1a1aa"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            secureTextEntry
                        />
                    )}
                />
                {errors.password && (
                    <CustomText className="text-red-500 text-xs mt-1 font-semibold">
                        {errors.password.message}
                    </CustomText>
                )}
            </View>

            <Button
                title="Next"
                onPress={handleSubmit(onSubmit)}
                className="mb-4"
            />
        </View>
    );
}