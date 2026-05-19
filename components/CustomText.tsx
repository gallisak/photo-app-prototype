import React from 'react';
import { Text, TextProps } from 'react-native';

interface CustomTextProps extends TextProps {
    variant?: 'title' | 'subtitle' | 'body';
    children: React.ReactNode;
    className?: string;
}

export default function CustomText({
    variant = 'body',
    children,
    className = '',
    ...props
}: CustomTextProps) {

    let variantClass = 'text-slate-300 text-base';

    if (variant === 'title') {
        variantClass = 'text-black text-2xl font-extrabold tracking-tight';
    } else if (variant === 'subtitle') {
        variantClass = 'text-black text-sm font-medium';
    }

    return (
        <Text className={`${variantClass} ${className}`} {...props}>
            {children}
        </Text>
    );
}