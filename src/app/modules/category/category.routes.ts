import { Router } from 'express';
import { CategoryController } from './category.controller';
import auth from '../../middleware/auth';
import { UserRole } from '../user/user.interface';
import validateRequest from '../../middleware/validateRequest';
import { categoryValidation } from './category.validation';

const router = Router();

router.get('/', auth(UserRole.ADMIN), CategoryController.getAllCategory);

router.post(
  '/',
  auth(UserRole.ADMIN),
  validateRequest(categoryValidation.createCategoryValidationSchema),
  CategoryController.createCategory,
);

export const CategoryRoutes = router;
