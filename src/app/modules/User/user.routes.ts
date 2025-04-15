import { Router } from 'express';
import { UserController } from './user.controller';
import validateRequest from '../../middleware/validateRequest';
import { UserValidation } from './user.validation';
import auth from '../../middleware/auth';
import { UserRole } from './user.interface';

const router = Router();

router.get('/', UserController.getAllUser);

router.get(
  '/me',
  auth(UserRole.ADMIN, UserRole.USER),
  UserController.myProfile,
);

router.post(
  '/',
  validateRequest(UserValidation.userValidationSchema),
  UserController.registerUser,
);

router.patch(
  '/update-profile',
  auth(UserRole.USER),
  validateRequest(UserValidation.customerInfoValidationSchema),
  UserController.updateProfile,
);

export const UserRoutes = router;
