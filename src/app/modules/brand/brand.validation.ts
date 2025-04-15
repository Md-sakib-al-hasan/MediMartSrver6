import { string, z } from 'zod';

const createCategoryValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .nonempty('Category name is required')
      .max(100, 'Category name should not exceed 100 characters'),
    logo: string(),
  }),
});

export const categoryValidation = {
  createCategoryValidationSchema,
};
