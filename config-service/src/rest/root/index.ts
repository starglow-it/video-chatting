import { Router } from 'express';
import configRoutes from './config/router';

const router = Router();

router.use('/config', configRoutes);

// eslint-disable-next-line import/no-default-export
export default router;
