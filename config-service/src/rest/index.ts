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

// eslint-disable-next-line import/no-default-export
export default router;
