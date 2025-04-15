import { Router } from 'express';
import auth from '../../middleware/auth';
import { UserRole } from '../user/user.interface';
import { ProductController } from './product.controller';
import validateRequest from '../../middleware/validateRequest';
import { productValidation } from './product.validation';

const router = Router();
router.get('/', ProductController.getAllProduct);
router.get('/:productId', ProductController.getSingleProduct);
router.post(
  '/',
  auth(UserRole.ADMIN),
  validateRequest(productValidation.createProductValidationSchema),
  ProductController.createProduct,
);

router.patch(
  '/:productId',
  auth(UserRole.ADMIN),
  ProductController.updateProduct,
);

router.delete(
  '/:productId',
  auth(UserRole.ADMIN),
  ProductController.deleteProduct,
);

export const ProductRoutes = router;
