import { z } from 'zod';

const createProductValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Product name is required',
      })
      .min(1, 'Product name cannot be empty'),

    description: z
      .string({
        required_error: 'Product description is required',
      })
      .min(1, 'Product description cannot be empty'),

    price: z
      .number({
        required_error: 'Product price is required',
      })
      .min(0, 'Product price cannot be less than 0'),

    stock: z
      .number({
        required_error: 'Product stock is required',
      })
      .min(0, 'Product stock cannot be less than 0'),

    offerPrice: z
      .number()
      .min(0, 'Offer price cannot be less than 0')
      .nullable()
      .optional(),

    category: z
      .string({
        required_error: 'Category ID is required',
      })
      .min(1, 'Category ID cannot be empty'),

    imageUrls: z.string({
      required_error: 'Image URLs are required',
    }),

    prescriptionRequired: z.boolean({
      required_error: 'Prescription requirement must be specified',
    }),

    prescriptionimage: z.string().optional(),

    isActive: z.boolean().optional().default(true),

    brand: z.string({
      required_error: 'Brand ID is required',
    }),

    ratingCount: z.number().optional().default(0),

    availableColors: z.array(z.string()).optional(),

    keyFeatures: z.array(z.string()).optional(),

    manufacturer: z.any().optional().default([]),

    expiredDate: z.coerce.date({
      required_error: 'Expired date is required',
    }),
  }),
});

const updateProductValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Product name cannot be empty').optional(),
    description: z
      .string()
      .min(1, 'Product description cannot be empty')
      .optional(),
    price: z.number().min(0, 'Product price cannot be less than 0').optional(),
    stock: z.number().min(0, 'Product stock cannot be less than 0').optional(),
    offerPrice: z
      .number()
      .min(0, 'Offer price cannot be less than 0')
      .nullable()
      .optional(),
    offer: z.number().min(0, 'Offer cannot be less than 0').optional(),
    category: z.string().min(1, 'Category ID cannot be empty').optional(),
    imageUrls: z.string({
      required_error: 'Image URLs are required',
    }),
  }),
});

export const productValidation = {
  createProductValidationSchema,
  updateProductValidationSchema,
};
