import { Router } from 'express';
import * as httpStatus from 'http-status';
import rootRoutes from './root';

const router = Router();

const startedAt = new Date();

router.use('/v1', rootRoutes);

router.get('/', (req, res) => {
    res.status(httpStatus.OK).json({
        startedAt,
        serverTime: new Date(),
    });
});

export default router;
