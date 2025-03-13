import { z } from 'zod';

export const createuserSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
  }),
});

export const SingleUserSchema = z.object({
  body: z.object({
    email: z.string().email('Must be Enter Eamil'),
  }),
});

export const UserValiditons = {
  createuserSchema,
  SingleUserSchema,
};
