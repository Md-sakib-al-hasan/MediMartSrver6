import { Router } from 'express';
import auth from '../../middleware/auth';
import { UserRole } from '../user/user.interface';
import { BrandController } from './brand.controller';

const router = Router();

router.get('/', auth(UserRole.ADMIN), BrandController.getAllBrand);

router.post('/', auth(UserRole.ADMIN), BrandController.createBrand);

export const BrandRoutes = router;
