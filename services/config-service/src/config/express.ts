import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as methodOverride from 'method-override';
import * as compress from 'compression';
import * as morgan from 'morgan';

import { vars } from './vars';

import {
    onApiError,
    onApiNotFound,
} from '../utils/rest/middlewares/errorHandler';
import routes from '../rest';

const { logs } = vars;

const app = express();

app.use(morgan(logs));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(compress());

app.use(methodOverride());

app.use('/', routes);

app.use(onApiNotFound);

app.use(onApiError);

export { app };
