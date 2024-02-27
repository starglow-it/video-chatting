"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.PaymentsModule = void 0;
var common_1 = require("@nestjs/common");
var nestjs_stripe_1 = require("nestjs-stripe");
// controllers
var payments_controller_1 = require("./payments.controller");
// services
var payments_service_1 = require("./payments.service");
var config_service_1 = require("../../services/config/config.service");
// modules
var config_module_1 = require("../../services/config/config.module");
var core_module_1 = require("../../services/core/core.module");
var notifications_module_1 = require("../../services/notifications/notifications.module");
var socket_module_1 = require("../../services/socket/socket.module");
var PaymentsModule = /** @class */ (function () {
    function PaymentsModule() {
    }
    PaymentsModule = __decorate([
        (0, common_1.Module)({
            imports: [
                core_module_1.CoreModule,
                notifications_module_1.NotificationsModule,
                socket_module_1.SocketModule,
                nestjs_stripe_1.StripeModule.forRootAsync({
                    imports: [config_module_1.ConfigModule],
                    inject: [config_service_1.ConfigClientService],
                    useFactory: function (config) { return __awaiter(void 0, void 0, void 0, function () {
                        var allConfig;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, config.getAll()];
                                case 1:
                                    allConfig = _a.sent();
                                    return [2 /*return*/, {
                                            apiKey: allConfig.stripeApiKey,
                                            apiVersion: '2022-08-01'
                                        }];
                            }
                        });
                    }); }
                }),
            ],
            controllers: [payments_controller_1.PaymentsController],
            providers: [payments_service_1.PaymentsService],
            exports: [payments_service_1.PaymentsService]
        })
    ], PaymentsModule);
    return PaymentsModule;
}());
exports.PaymentsModule = PaymentsModule;
