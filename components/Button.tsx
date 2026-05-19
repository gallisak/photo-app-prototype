import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    onPress: () => void;
    isLoading?: boolean;
    variant?: 'primary' | 'outline';
    className?: string;
}

export default function Button({
    title,
    onPress,
    isLoading = false,
    variant = 'primary',
    className = '',
    disabled,
    ...props
}: ButtonProps) {

    const isPrimary = variant === 'primary';

    const baseButtonClass = "w-full h-14 rounded flex-row justify-center items-center tracking-widest";

    const bgClass = isPrimary
        ? "bg-black active:bg-zinc-800"
        : "bg-white border-2 border-black active:bg-zinc-100";

    const disabledClass = (disabled || isLoading) ? "bg-zinc-300 opacity-50" : bgClass;

    const textClass = isPrimary ? "text-white" : "text-black";

    return (
        <TouchableOpacity
            className={`${baseButtonClass} ${disabledClass} ${className}`}
            onPress={onPress}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <ActivityIndicator color={isPrimary ? "#ffffff" : "#000000"} />
            ) : (
                <Text className={`${textClass} font-bold text-sm uppercase tracking-widest`}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
}