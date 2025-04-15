import { Router } from 'express';
import { MetaController } from './meta.controller';

const router = Router();

router.get(
  '/',
  // auth(UserRole.ADMIN),
  MetaController.getMetaData,
);

export const MetaRoutes = router;
