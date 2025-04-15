import { Router } from 'express';
import { MessageController } from './message.controller';
import validateRequest from '../../middleware/validateRequest';
import { MessageZodSchema } from './message.validitons';
import auth from '../../middleware/auth';
import { UserRole } from '../user/user.interface';

const router = Router();

router.post(
  '/',
  validateRequest(MessageZodSchema),
  MessageController.createMessage,
);
router.get(
  '/:userId',
  auth(UserRole.USER, UserRole.ADMIN),
  MessageController.getAllMesage,
);

export const CouponRoutes = router;
