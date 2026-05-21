import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomText from '../../src/components/ui/CustomText';
import Button from '../../src/components/ui/Button';
import { Undo2 } from 'lucide-react-native';
import { useRegisterStep2 } from '../../src/features/auth/hooks/useRegisterStep2';
import { registerStep2Schema, RegisterStep2FormData } from '../../src/features/auth/schemas/registerSchema';

export default function RegisterStep2Screen() {
    const router = useRouter();
    const { handleRegister, isLoading } = useRegisterStep2();

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterStep2FormData>({
        resolver: zodResolver(registerStep2Schema),
        defaultValues: {
            name: '',
        },
    });

    const onSubmit = async (data: RegisterStep2FormData) => {
        await handleRegister(data.name);
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
                    name="name"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            className={`w-full h-14 border-2 px-4 text-black font-semibold tracking-wider ${errors.name ? 'border-red-500' : 'border-black'
                                }`}
                            placeholder="NAME"
                            placeholderTextColor="#a1a1aa"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            autoCapitalize="words"
                        />
                    )}
                />
                {errors.name && (
                    <CustomText className="text-red-500 text-xs mt-1 font-semibold">
                        {errors.name.message}
                    </CustomText>
                )}
            </View>

            <Button
                title={isLoading || isSubmitting ? "SIGNING UP..." : "SIGN UP"}
                onPress={handleSubmit(onSubmit)}
                className="mb-4"
                disabled={isLoading || isSubmitting}
            />

            <CustomText variant='subtitle'>
                By signing up, you agree to Photo’s <Text className='underline'>Terms of Service</Text> and <Text className='underline'>Privacy Policy</Text>.
            </CustomText>
        </View>
    );
}