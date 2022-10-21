import { Router } from 'express';
import * as controller from './controller';

const router: Router = Router();

/**
 * @api {Get} /v1/hello/world Hello world
 * @apiName GetHelloWorld
 * @apiGroup Hello
 *
 * @apiParam {String} hello string
 *
 * @apiSuccess {String} hello String
 */
router.get('/:key', controller.getConfigKey);

router.get('/', controller.getAllConfigKeys);

export default router;
