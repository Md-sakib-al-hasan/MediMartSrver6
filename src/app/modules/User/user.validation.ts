import { z } from 'zod';
import { UserRole } from './user.interface';
import { UserGender } from './user.constant';

export const userValidationSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    name: z.string().min(1, 'Name is required'),
    role: z.enum([UserRole.USER, UserRole.ADMIN]).optional(),
    status: z.string().min(1, 'Status is required'),
    profilePicture: z.string().optional(),
    phone: z.string().optional(),
    gender: z.enum(UserGender).optional(),
    address: z.string().optional(),
    dateOfBirth: z.coerce.date().optional(),
    lastLogin: z.coerce.date().optional(),
    isActive: z.boolean().optional(),
  }),
});

const customerInfoValidationSchema = z.object({
  body: z
    .object({
      email: z.string().email('Invalid email address').optional(),
      password: z
        .string()
        .min(6, 'Password must be at least 6 characters long')
        .optional(),
      name: z.string().min(1, 'Name is required').optional(),
      status: z.string().min(1, 'Status is required').optional(),
      profilePicture: z.string().optional(),
      phone: z.string().optional(),
      gender: z.enum(UserGender).optional(),
      address: z.string().optional(),
      dateOfBirth: z.coerce.date().optional(),
      lastLogin: z.coerce.date().optional(),
      isActive: z.boolean().optional(),
    })
    .strict(),
});

export const UserValidation = {
  userValidationSchema,
  customerInfoValidationSchema,
};
