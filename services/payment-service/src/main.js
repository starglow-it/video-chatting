"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var core_1 = require("@nestjs/core");
var express = require("express");
var microservices_1 = require("@nestjs/microservices");
var app_module_1 = require("./app.module");
var config_service_1 = require("./services/config/config.service");
var payments_controller_1 = require("./modules/payments/payments.controller");
var payments_module_1 = require("./modules/payments/payments.module");
function bootstrap() {
    return __awaiter(this, void 0, void 0, function () {
        var app, configService, config, port, paymentMicroservice, paymentsController;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, core_1.NestFactory.create(app_module_1.AppModule)];
                case 1:
                    app = _a.sent();
                    configService = app.get(config_service_1.ConfigClientService);
                    return [4 /*yield*/, configService.getAll()];
                case 2:
                    config = _a.sent();
                    port = 5000;
                    app.use('/payments/webhook', express.raw({ type: 'application/json' }));
                    app.use('/payments/express-webhook', express.raw({ type: 'application/json' }));
                    return [4 /*yield*/, core_1.NestFactory.createMicroservice(payments_module_1.PaymentsModule, {
                            transport: microservices_1.Transport.RMQ,
                            options: {
                                urls: [
                                    "amqp://".concat(config.rabbitMqUser, ":").concat(config.rabbitMqPass, "@").concat(config.rabbitMqHost),
                                ],
                                queue: config.rabbitMqPaymentQueue,
                                queueOptions: {
                                    durable: false
                                }
                            }
                        })];
                case 3:
                    paymentMicroservice = _a.sent();
                    paymentsController = paymentMicroservice.get(payments_controller_1.PaymentsController);
                    return [4 /*yield*/, paymentMicroservice.listen()];
                case 4:
                    _a.sent();
                    app.connectMicroservice(paymentMicroservice);
                    return [4 /*yield*/, paymentsController.createSubscriptionsIfNotExists()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, app.listen(port, function () {
                            return console.log("Payment service started at port ".concat(port));
                        })];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
bootstrap();
process.on('uncaughtException', function (err) { return console.log(err); });
process.on('unhandledRejection', function (reason) { return console.log(reason); });
