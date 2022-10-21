import { Router } from 'express';
import configRoutes from './config/router';

const router: Router = Router();

router.use('/config', configRoutes);

export default router;
