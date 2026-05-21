import { z } from 'zod';

export const registerStep1Schema = z.object({
    email: z
        .string()
        .min(1, { message: 'Email is required' })
        .email({ message: 'Please enter a valid email' }),
    password: z
        .string()
        .min(6, { message: 'Password must be at least 6 characters' }),
});

export type RegisterStep1FormData = z.infer<typeof registerStep1Schema>;