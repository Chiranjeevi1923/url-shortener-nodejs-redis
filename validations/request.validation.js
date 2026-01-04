import { optional, z } from 'zod';
export const signupPostRequestBodySchema = z.object({
    firstname: z.string().min(2).max(55),
    lastname: z.string().optional(),
    email: z.email(),
    password: z.string().min(3)
});

export const loginPostRequestBodySchema = z.object({
    email: z.email(),
    password: z.string().min(3)
});

export const urlPostRequestBodySchema = z.object({
    url: z.url(),
    code: z.string().min(3).max(55).optional()
});