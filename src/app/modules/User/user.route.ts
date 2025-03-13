import express from 'express';
import { UserControllers } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { UserValiditons } from './user.validtion';

const router = express.Router();

router.post(
  '/create-user',
  validateRequest(UserValiditons.createuserSchema),
  UserControllers.createCustomer,
);

router.post(
  '/singleUser',
  validateRequest(UserValiditons.SingleUserSchema),
  UserControllers.getsingleuser,
);

export const UserRoutes = router;
