"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.PaymentsController = void 0;
var common_1 = require("@nestjs/common");
var microservices_1 = require("@nestjs/microservices");
// patterns
var shared_const_1 = require("shared-const");
// const
var shared_const_2 = require("shared-const");
// utils
var addMonths_1 = require("../../utils/dates/addMonths");
var addDaysCustom_1 = require("../../utils/dates/addDaysCustom");
var executePromiseQueue_1 = require("../../utils/executePromiseQueue");
// payloads
var shared_types_1 = require("shared-types");
var PaymentsController = /** @class */ (function () {
    function PaymentsController(configService, notificationsService, paymentService, coreService, socketService) {
        this.configService = configService;
        this.notificationsService = notificationsService;
        this.paymentService = paymentService;
        this.coreService = coreService;
        this.socketService = socketService;
        this.logger = new common_1.Logger(PaymentsController_1.name);
    }
    PaymentsController_1 = PaymentsController;
    PaymentsController.prototype.webhookHandler = function (body, req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var signature, event_1, _a, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 18, , 19]);
                        signature = req.headers['stripe-signature'];
                        return [4 /*yield*/, this.paymentService.createWebhookEvent({
                                body: body,
                                sig: signature
                            })];
                    case 1:
                        event_1 = _b.sent();
                        _a = event_1.type;
                        switch (_a) {
                            case 'checkout.session.completed': return [3 /*break*/, 2];
                            case 'customer.subscription.deleted': return [3 /*break*/, 4];
                            case 'customer.subscription.created': return [3 /*break*/, 6];
                            case 'customer.subscription.updated': return [3 /*break*/, 8];
                            case 'invoice.paid': return [3 /*break*/, 10];
                            case 'charge.succeeded': return [3 /*break*/, 12];
                            case 'customer.subscription.trial_will_end': return [3 /*break*/, 14];
                        }
                        return [3 /*break*/, 16];
                    case 2:
                        this.logger.log('handle "checkout.session.completed" event');
                        return [4 /*yield*/, this.handleCheckoutSessionCompleted(event_1.data.object)];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 17];
                    case 4:
                        this.logger.log('handle "customer.subscription.deleted" event');
                        return [4 /*yield*/, this.handleSubscriptionDeleted(event_1.data.object)];
                    case 5:
                        _b.sent();
                        return [3 /*break*/, 17];
                    case 6:
                        this.logger.log('handle "customer.subscription.created" event');
                        return [4 /*yield*/, this.handleSubscriptionCreated(event_1.data.object)];
                    case 7:
                        _b.sent();
                        return [3 /*break*/, 17];
                    case 8:
                        this.logger.log('handle "customer.subscription.updated" event');
                        return [4 /*yield*/, this.handleSubscriptionUpdate(event_1.data.object)];
                    case 9:
                        _b.sent();
                        return [3 /*break*/, 17];
                    case 10:
                        this.logger.log('handle "invoice.paid" event');
                        return [4 /*yield*/, this.handleFirstSubscription(event_1.data.object)];
                    case 11:
                        _b.sent();
                        return [3 /*break*/, 17];
                    case 12:
                        this.logger.log('handle "charge.succeeded" event');
                        return [4 /*yield*/, this.handleChargeSuccess(event_1.data.object)];
                    case 13:
                        _b.sent();
                        return [3 /*break*/, 17];
                    case 14:
                        this.logger.log('handle "customer.subscription.trial_will_end" event');
                        return [4 /*yield*/, this.handleTrialWillEnd(event_1.data.object)];
                    case 15:
                        _b.sent();
                        return [3 /*break*/, 17];
                    case 16:
                        console.log("Unhandled event type ".concat(event_1.type, "."));
                        _b.label = 17;
                    case 17:
                        // Return a 200 response to acknowledge receipt of the event
                        res.send();
                        return [3 /*break*/, 19];
                    case 18:
                        err_1 = _b.sent();
                        this.logger.error({
                            message: "An error occurs, while stripe webhooks event"
                        }, JSON.stringify(err_1.message));
                        throw new common_1.BadRequestException(err_1.message);
                    case 19: return [2 /*return*/];
                }
            });
        });
    };
    PaymentsController.prototype.expressWebhookHandler = function (body, req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var signature, event_2, _a, accountData, frontendUrl, user, err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 9, , 10]);
                        signature = req.headers['stripe-signature'];
                        return [4 /*yield*/, this.paymentService.createExpressWebhookEvent({
                                body: body,
                                sig: signature
                            })];
                    case 1:
                        event_2 = _b.sent();
                        _a = event_2.type;
                        switch (_a) {
                            case 'account.updated': return [3 /*break*/, 2];
                        }
                        return [3 /*break*/, 7];
                    case 2:
                        this.logger.log('handle "account.updated" on express webhook event');
                        accountData = event_2.data.object;
                        if (!(accountData.payouts_enabled || accountData.details_submitted)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.configService.get('frontendUrl')];
                    case 3:
                        frontendUrl = _b.sent();
                        return [4 /*yield*/, this.coreService.findUser({
                                stripeAccountId: accountData.id
                            })];
                    case 4:
                        user = _b.sent();
                        if (!(!user.isStripeEnabled && user.id && accountData.id)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.coreService.updateUser({
                                query: { stripeAccountId: accountData.id },
                                data: { isStripeEnabled: true }
                            })];
                    case 5:
                        _b.sent();
                        this.notificationsService.sendEmail({
                            template: {
                                key: shared_const_2.emailTemplates.stripeLinked,
                                data: [
                                    {
                                        name: 'BACKURL',
                                        content: "".concat(frontendUrl, "/dashboard/profile")
                                    },
                                ]
                            },
                            to: [{ email: user.email, name: user.fullName }]
                        });
                        _b.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        console.log("Unhandled event type ".concat(event_2.type, "."));
                        _b.label = 8;
                    case 8:
                        // Return a 200 response to acknowledge receipt of the event
                        res.send();
                        return [3 /*break*/, 10];
                    case 9:
                        err_2 = _b.sent();
                        this.logger.error({
                            message: "An error occurs, while stripe express webhook event"
                        }, JSON.stringify(err_2));
                        throw new common_1.BadRequestException(err_2);
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    PaymentsController.prototype.createStripeExpressAccount = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var account, accountLink, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        this.logger.log({
                            message: "createStripeExpressAccount input payload",
                            ctx: payload
                        });
                        if (!!payload.accountId) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.paymentService.createExpressAccount({
                                email: payload.email
                            })];
                    case 1:
                        account = _a.sent();
                        return [4 /*yield*/, this.paymentService.createExpressAccountLink({
                                accountId: account.id
                            })];
                    case 2:
                        accountLink = _a.sent();
                        return [2 /*return*/, {
                                accountId: account.id,
                                accountLink: accountLink.url,
                                accountEmail: account.email
                            }];
                    case 3: return [2 /*return*/, {
                            accountId: '',
                            accountLink: ''
                        }];
                    case 4:
                        err_3 = _a.sent();
                        throw new microservices_1.RpcException({
                            message: err_3.message,
                            ctx: shared_const_2.PAYMENTS_SERVICE
                        });
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    PaymentsController.prototype.createStripeAccountLink = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var accountLink;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.log({
                            message: "createStripeAccountLink input payload",
                            ctx: payload
                        });
                        return [4 /*yield*/, this.paymentService.createExpressAccountLink({
                                accountId: payload.accountId
                            })];
                    case 1:
                        accountLink = _a.sent();
                        return [2 /*return*/, {
                                accountLink: accountLink.url
                            }];
                }
            });
        });
    };
    PaymentsController.prototype.loginStripeExpressAccount = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var existedAccount, loginLink, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        this.logger.log({
                            message: "loginStripeExpressAccount input payload",
                            ctx: payload
                        });
                        return [4 /*yield*/, this.paymentService.getExpressAccount({
                                accountId: payload.accountId
                            })];
                    case 1:
                        existedAccount = _a.sent();
                        return [4 /*yield*/, this.paymentService.createExpressAccountLoginLink({ accountId: existedAccount.id })];
                    case 2:
                        loginLink = _a.sent();
                        return [2 /*return*/, {
                                accountLink: loginLink.url
                            }];
                    case 3:
                        err_4 = _a.sent();
                        throw new microservices_1.RpcException({
                            message: err_4.message,
                            ctx: shared_const_2.PAYMENTS_SERVICE
                        });
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PaymentsController.prototype.deleteStripeExpressAccount = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.logger.log({
                            message: "deleteStripeExpressAccount input payload",
                            ctx: payload
                        });
                        return [4 /*yield*/, this.paymentService.deleteExpressAccount({
                                accountId: payload.accountId
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                    case 2:
                        err_5 = _a.sent();
                        throw new microservices_1.RpcException({
                            message: err_5.message,
                            ctx: shared_const_2.PAYMENTS_SERVICE
                        });
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PaymentsController.prototype.createPaymentIntent = function (payload) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var product, subscription, plan, paymentIntent, err_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        this.logger.log({
                            message: "createPaymentIntent input payload",
                            ctx: payload
                        });
                        product = null;
                        if (!payload.stripeSubscriptionId) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.paymentService.getSubscription(payload.stripeSubscriptionId)];
                    case 1:
                        subscription = _b.sent();
                        return [4 /*yield*/, this.paymentService.getStripeProduct((_a = subscription === null || subscription === void 0 ? void 0 : subscription['plan']) === null || _a === void 0 ? void 0 : _a.product)];
                    case 2:
                        product = _b.sent();
                        _b.label = 3;
                    case 3:
                        plan = shared_const_2.plans[(product === null || product === void 0 ? void 0 : product.name) || shared_types_1.PlanKeys.House];
                        return [4 /*yield*/, this.paymentService.createPaymentIntent({
                                templatePrice: payload.templatePrice,
                                templateCurrency: payload.templateCurrency,
                                stripeAccountId: payload.stripeAccountId,
                                platformFee: plan.features.comissionFee[payload.meetingRole],
                                templateId: payload.templateId
                            })];
                    case 4:
                        paymentIntent = _b.sent();
                        return [2 /*return*/, {
                                id: paymentIntent.id,
                                clientSecret: paymentIntent.client_secret
                            }];
                    case 5:
                        err_6 = _b.sent();
                        throw new microservices_1.RpcException({
                            message: err_6.message,
                            ctx: shared_const_2.PAYMENTS_SERVICE
                        });
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    PaymentsController.prototype.cancelPaymentIntent = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var paymentIntent, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        this.logger.log({
                            message: "cancelPaymentIntent input payload",
                            ctx: payload
                        });
                        return [4 /*yield*/, this.paymentService.getPaymentIntent({
                                paymentIntentId: payload.paymentIntentId
                            })];
                    case 1:
                        paymentIntent = _a.sent();
                        if (![
                            'requires_payment_method',
                            'requires_capture',
                            'requires_confirmation',
                            'requires_action',
                            'processing',
                        ].includes(paymentIntent.status)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.paymentService.cancelPaymentIntent({
                                paymentIntentId: payload.paymentIntentId
                            })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                    case 4:
                        err_7 = _a.sent();
                        throw new microservices_1.RpcException({
                            message: err_7.message,
                            ctx: shared_const_2.PAYMENTS_SERVICE
                        });
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    PaymentsController.prototype.getStripeTemplatesProducts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var products, pricesPromise, err_8;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.paymentService.getStripeProducts()];
                    case 1:
                        products = _a.sent();
                        pricesPromise = products.data.map(function (product) { return __awaiter(_this, void 0, void 0, function () {
                            var price;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.paymentService.getProductPrice(product.id)];
                                    case 1:
                                        price = _a.sent();
                                        return [2 /*return*/, {
                                                product: product,
                                                price: price
                                            }];
                                }
                            });
                        }); });
                        return [4 /*yield*/, Promise.all(pricesPromise)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        err_8 = _a.sent();
                        throw new microservices_1.RpcException({
                            message: err_8.message,
                            ctx: shared_const_2.PAYMENTS_SERVICE
                        });
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PaymentsController.prototype.getStripeSubscriptionsProducts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var subscriptionProducts, pricesPromise, err_9;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.paymentService.getStripeSubscriptions()];
                    case 1:
                        subscriptionProducts = _a.sent();
                        pricesPromise = subscriptionProducts.map(function (product) { return __awaiter(_this, void 0, void 0, function () {
                            var price;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.paymentService.getProductPrice(product.id)];
                                    case 1:
                                        price = _a.sent();
                                        return [2 /*return*/, {
                                                product: product,
                                                price: price
                                            }];
                                }
                            });
                        }); });
                        return [4 /*yield*/, Promise.all(pricesPromise)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        err_9 = _a.sent();
                        throw new microservices_1.RpcException({
                            message: err_9.message,
                            ctx: shared_const_2.PAYMENTS_SERVICE
                        });
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PaymentsController.prototype.getStripeCheckoutSession = function (payload) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var environment, product, price, plan, user, customer, session, err_10;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 11, , 12]);
                        this.logger.log({
                            message: "getStripeCheckoutSession input payload",
                            ctx: payload
                        });
                        return [4 /*yield*/, this.configService.get('environment')];
                    case 1:
                        environment = _b.sent();
                        return [4 /*yield*/, this.paymentService.getStripeProduct(payload.productId)];
                    case 2:
                        product = _b.sent();
                        return [4 /*yield*/, this.paymentService.getProductPrice(product.id)];
                    case 3:
                        price = _b.sent();
                        plan = shared_const_2.plans[(_a = product.name) !== null && _a !== void 0 ? _a : shared_types_1.PlanKeys.House];
                        return [4 /*yield*/, this.coreService.findUser({
                                email: payload.customerEmail
                            })];
                    case 4:
                        user = _b.sent();
                        customer = void 0;
                        if (!user.stripeCustomerId) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.paymentService.getCustomer({
                                customerId: user.stripeCustomerId
                            })];
                    case 5:
                        customer = (_b.sent());
                        _b.label = 6;
                    case 6:
                        if (!!customer) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.paymentService.createCustomer(user)];
                    case 7:
                        customer = _b.sent();
                        _b.label = 8;
                    case 8: return [4 /*yield*/, this.paymentService.getStripeCheckoutSession({
                            paymentMode: 'subscription',
                            priceId: price.id,
                            basePath: payload.baseUrl,
                            cancelPath: payload.cancelUrl,
                            meetingToken: payload.meetingToken,
                            customerEmail: user.email,
                            customer: customer.id,
                            trialPeriodEndTimestamp: payload.withTrial
                                ? ['production'].includes(environment)
                                    ? plan.trialPeriodDays
                                    : plan.testTrialPeriodDays
                                : undefined
                        })];
                    case 9:
                        session = _b.sent();
                        return [4 /*yield*/, this.coreService.findUserAndUpdate({
                                userId: user.id,
                                data: {
                                    stripeSessionId: session.id,
                                    stripeCustomerId: customer.id
                                }
                            })];
                    case 10:
                        _b.sent();
                        return [2 /*return*/, session];
                    case 11:
                        err_10 = _b.sent();
                        throw new microservices_1.RpcException({
                            message: err_10.message,
                            ctx: shared_const_2.PAYMENTS_SERVICE
                        });
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    PaymentsController.prototype.getStripePortalSession = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var frontendUrl, subscription, err_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        this.logger.log({
                            message: "getStripePortalSession input payload",
                            ctx: payload
                        });
                        return [4 /*yield*/, this.configService.get('frontendUrl')];
                    case 1:
                        frontendUrl = _a.sent();
                        return [4 /*yield*/, this.paymentService.getSubscription(payload.subscriptionId)];
                    case 2:
                        subscription = _a.sent();
                        return [2 /*return*/, this.paymentService.createSessionPortal(subscription.customer, "".concat(frontendUrl, "/dashboard/profile"))];
                    case 3:
                        err_11 = _a.sent();
                        throw new microservices_1.RpcException({
                            message: err_11.message,
                            ctx: shared_const_2.PAYMENTS_SERVICE
                        });
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PaymentsController.prototype.getStripeSubscription = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var err_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.logger.log({
                            message: "getStripePortalSession input payload",
                            ctx: payload
                        });
                        return [4 /*yield*/, this.paymentService.getSubscription(payload.subscriptionId)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_12 = _a.sent();
                        throw new microservices_1.RpcException({
                            message: err_12.message,
                            ctx: shared_const_2.PAYMENTS_SERVICE
                        });
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PaymentsController.prototype.createTemplateStripeProduct = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, this.paymentService.createProduct(__assign({ type: 'template' }, payload))];
                }
                catch (err) {
                    throw new microservices_1.RpcException({
                        message: err.message,
                        ctx: shared_const_2.PAYMENTS_SERVICE
                    });
                }
                return [2 /*return*/];
            });
        });
    };
    PaymentsController.prototype.getTemplateStripeProduct = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, this.paymentService.getProduct(payload.productId)];
                }
                catch (err) {
                    throw new microservices_1.RpcException({
                        message: err.message,
                        ctx: shared_const_2.PAYMENTS_SERVICE
                    });
                }
                return [2 /*return*/];
            });
        });
    };
    PaymentsController.prototype.getTemplateStripeProductByName = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var templatesList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.paymentService.getStripeTemplates()];
                    case 1:
                        templatesList = _a.sent();
                        return [2 /*return*/, templatesList.filter(function (template) { return template.name === payload.name; })[0]];
                }
            });
        });
    };
    PaymentsController.prototype.updateStripeTemplateProduct = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.paymentService.updateProduct(payload.productId, payload.data)];
            });
        });
    };
    PaymentsController.prototype.deleteTemplateStripeProduct = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.paymentService.deleteStripeProduct(payload)];
            });
        });
    };
    PaymentsController.prototype.cancelUserSubscription = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.paymentService.cancelStripeSubscription(payload)];
            });
        });
    };
    PaymentsController.prototype.getProductCheckoutSession = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var product, price, err_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.paymentService.getProduct(payload.productId)];
                    case 1:
                        product = _a.sent();
                        return [4 /*yield*/, this.paymentService.getProductPrice(product.id)];
                    case 2:
                        price = _a.sent();
                        if (product === null || product === void 0 ? void 0 : product.id) {
                            return [2 /*return*/, this.paymentService.getStripeCheckoutSession({
                                    paymentMode: 'payment',
                                    priceId: price.id,
                                    basePath: 'dashboard',
                                    customerEmail: payload.customerEmail,
                                    customer: payload.customer,
                                    userId: payload.userId,
                                    templateId: payload.templateId
                                })];
                        }
                        return [2 /*return*/, {}];
                    case 3:
                        err_13 = _a.sent();
                        throw new microservices_1.RpcException({
                            message: err_13.message,
                            ctx: shared_const_2.PAYMENTS_SERVICE
                        });
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PaymentsController.prototype.getStripeCharges = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    if (payload.type === 'subscription') {
                        return [2 /*return*/, this.paymentService.getSubscriptionCharges(payload)];
                    }
                    if (payload.type === 'transactions') {
                        return [2 /*return*/, this.paymentService.getTransactionsCharges(payload)];
                    }
                    if (payload.type === 'roomsPurchase') {
                        return [2 /*return*/, this.paymentService.getRoomsPurchaseCharges(payload)];
                    }
                    return [2 /*return*/, this.paymentService.getCharges(payload)];
                }
                catch (err) {
                    throw new microservices_1.RpcException({
                        message: err.message,
                        ctx: shared_const_2.PAYMENTS_SERVICE
                    });
                }
                return [2 /*return*/];
            });
        });
    };
    PaymentsController.prototype.handleFirstSubscription = function (invoice) {
        return __awaiter(this, void 0, void 0, function () {
            var subscription, productData, frontendUrl, user, currentPlanName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.paymentService.getSubscription(invoice.subscription)];
                    case 1:
                        subscription = _a.sent();
                        return [4 /*yield*/, this.paymentService.getStripeProduct(subscription['plan'].product)];
                    case 2:
                        productData = _a.sent();
                        return [4 /*yield*/, this.configService.get('frontendUrl')];
                    case 3:
                        frontendUrl = _a.sent();
                        return [4 /*yield*/, this.coreService.findUser({
                                stripeSubscriptionId: subscription.id
                            })];
                    case 4:
                        user = _a.sent();
                        currentPlanName = shared_const_2.plans[productData.name || shared_types_1.PlanKeys.House];
                        return [4 /*yield*/, this.coreService.updateUser({
                                query: { stripeSubscriptionId: subscription.id },
                                data: {
                                    isSubscriptionActive: ['active', 'trialing'].includes(subscription.status),
                                    renewSubscriptionTimestampInSeconds: subscription.current_period_end
                                }
                            })];
                    case 5:
                        _a.sent();
                        if (Boolean(user.isSubscriptionActive) === false &&
                            ['active', 'trialing'].includes(subscription.status) &&
                            currentPlanName.features.emailSlug) {
                            console.log('send email');
                            this.notificationsService.sendEmail({
                                template: {
                                    key: shared_const_2.emailTemplates[currentPlanName.features.emailSlug],
                                    data: [
                                        {
                                            name: 'BACKURL',
                                            content: "".concat(frontendUrl, "/dashboard/profile")
                                        },
                                        {
                                            name: 'USERNAME',
                                            content: user.fullName
                                        },
                                    ]
                                },
                                to: [{ email: user.email, name: user.fullName }]
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    PaymentsController.prototype.handleSubscriptionUpdate = function (subscription) {
        return __awaiter(this, void 0, void 0, function () {
            var user, updateData, productData, currentPlan, nextPlan, isPlanHasChanged, isPlanDowngraded, isCurrentSubscriptionIsActive, isSubscriptionPeriodUpdated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.coreService.findUser({
                            stripeCustomerId: subscription.customer
                        })];
                    case 1:
                        user = _a.sent();
                        updateData = {};
                        if (!user.stripeSubscriptionId) {
                            Object.assign(updateData, {
                                stripeSubscriptionId: subscription.id
                            });
                        }
                        return [4 /*yield*/, this.paymentService.getStripeProduct(subscription['plan'].product)];
                    case 2:
                        productData = _a.sent();
                        currentPlan = shared_const_2.plans[user.subscriptionPlanKey || shared_types_1.PlanKeys.House];
                        nextPlan = shared_const_2.plans[productData.name || shared_types_1.PlanKeys.House];
                        isPlanHasChanged = nextPlan.name !== currentPlan.name;
                        isPlanDowngraded = currentPlan.priceInCents > nextPlan.priceInCents;
                        isCurrentSubscriptionIsActive = user.renewSubscriptionTimestampInSeconds * 1000 > Date.now();
                        isSubscriptionPeriodUpdated = user.renewSubscriptionTimestampInSeconds <
                            subscription.current_period_end;
                        Object.assign(updateData, {
                            subscriptionPlanKey: isSubscriptionPeriodUpdated
                                ? nextPlan.name
                                : currentPlan.name,
                            nextSubscriptionPlanKey: !isSubscriptionPeriodUpdated
                                ? nextPlan.name
                                : null,
                            prevSubscriptionPlanKey: user.subscriptionPlanKey,
                            maxTemplatesNumber: isSubscriptionPeriodUpdated
                                ? nextPlan.features.templatesLimit
                                : currentPlan.features.templatesLimit,
                            maxMeetingTime: isSubscriptionPeriodUpdated
                                ? nextPlan.features.timeLimit
                                : currentPlan.features.timeLimit,
                            renewSubscriptionTimestampInSeconds: isCurrentSubscriptionIsActive
                                ? user.renewSubscriptionTimestampInSeconds
                                : subscription.current_period_end,
                            isDowngradeMessageShown: !(isPlanHasChanged &&
                                isPlanDowngraded &&
                                (isCurrentSubscriptionIsActive || isSubscriptionPeriodUpdated))
                        });
                        return [4 /*yield*/, this.coreService.updateUser({
                                query: { stripeSubscriptionId: subscription.id },
                                data: updateData
                            })];
                    case 3:
                        _a.sent();
                        if (!isSubscriptionPeriodUpdated) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.coreService.deleteLeastUsedUserTemplates({
                                userId: user.id,
                                templatesLimit: nextPlan.features.templatesLimit
                            })];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    PaymentsController.prototype.handleSubscriptionDeleted = function (subscription) {
        return __awaiter(this, void 0, void 0, function () {
            var environment, planData, trialExpired, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.configService.get('environment')];
                    case 1:
                        environment = _a.sent();
                        planData = shared_const_2.plans[shared_types_1.PlanKeys.House];
                        trialExpired = subscription.trial_end === subscription.current_period_end;
                        return [4 /*yield*/, this.coreService.findUser({
                                stripeSubscriptionId: subscription.id
                            })];
                    case 2:
                        user = _a.sent();
                        return [4 /*yield*/, this.coreService.updateUser({
                                query: { stripeSubscriptionId: subscription.id },
                                data: {
                                    isSubscriptionActive: false,
                                    stripeSubscriptionId: null,
                                    subscriptionPlanKey: shared_types_1.PlanKeys.House,
                                    maxTemplatesNumber: planData.features.templatesLimit,
                                    maxMeetingTime: planData.features.timeLimit,
                                    shouldShowTrialExpiredNotification: trialExpired,
                                    renewSubscriptionTimestampInSeconds: (['production', 'demo'].includes(environment)
                                        ? (0, addMonths_1.addMonthsCustom)(Date.now(), 1)
                                        : (0, addDaysCustom_1.addDaysCustom)(Date.now(), 1)).getTime() / 1000
                                }
                            })];
                    case 3:
                        _a.sent();
                        if (!trialExpired) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.socketService.sendTrialExpiredNotification({
                                userId: user.id
                            })];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [4 /*yield*/, this.coreService.deleteLeastUsedUserTemplates({
                            userId: user.id,
                            templatesLimit: planData.features.templatesLimit
                        })];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PaymentsController.prototype.handleSubscriptionCreated = function (subscription) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.coreService.updateUser({
                            query: { stripeCustomerId: subscription.customer },
                            data: {
                                isSubscriptionActive: false,
                                stripeSubscriptionId: subscription.id
                            }
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PaymentsController.prototype.createSubscriptionsIfNotExists = function () {
        return __awaiter(this, void 0, void 0, function () {
            var subscriptions, plansPromises;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.paymentService.getStripeSubscriptions()];
                    case 1:
                        subscriptions = _a.sent();
                        if (!!(subscriptions === null || subscriptions === void 0 ? void 0 : subscriptions.length)) return [3 /*break*/, 3];
                        plansPromises = Object.values(shared_const_2.plans).map(function (planData) { return function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, this.paymentService.createProduct({
                                        name: planData.name,
                                        priceInCents: planData.priceInCents,
                                        description: planData.description,
                                        type: 'subscription'
                                    })];
                            });
                        }); }; });
                        return [4 /*yield*/, (0, executePromiseQueue_1.executePromiseQueue)(plansPromises)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PaymentsController.prototype.handleCheckoutSessionCompleted = function (session) {
        return __awaiter(this, void 0, void 0, function () {
            var subscription, product, plan;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!session.subscription) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.paymentService.getSubscription(session.subscription)];
                    case 1:
                        subscription = _a.sent();
                        return [4 /*yield*/, this.paymentService.getStripeProduct(subscription['plan'].product)];
                    case 2:
                        product = _a.sent();
                        plan = shared_const_2.plans[product.name || shared_types_1.PlanKeys.House];
                        return [4 /*yield*/, this.coreService.updateUser({
                                query: { stripeSessionId: session.id },
                                data: {
                                    stripeSubscriptionId: session.subscription,
                                    subscriptionPlanKey: plan.name,
                                    maxTemplatesNumber: plan.features.templatesLimit,
                                    maxMeetingTime: plan.features.timeLimit,
                                    isProfessionalTrialAvailable: false
                                }
                            })];
                    case 3:
                        _a.sent();
                        if (!(subscription.status === 'trialing' &&
                            !subscription.cancel_at_period_end)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.paymentService.updateSubscription({
                                subscriptionId: subscription.id,
                                options: { cancelAtPeriodEnd: true }
                            })];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [4 /*yield*/, this.coreService.updateMonetizationStatistic({
                            period: shared_types_1.MonetizationStatisticPeriods.AllTime,
                            type: shared_types_1.MonetizationStatisticTypes.Subscriptions,
                            value: session.amount_total
                        })];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    PaymentsController.prototype.handleChargeSuccess = function (charge) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var isTransactionCharge, isTemplateCharge, userTemplate, commonTemplate, transferUser;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        isTransactionCharge = Boolean(parseInt(charge.metadata.isTransactionCharge, 10));
                        isTemplateCharge = ((_a = charge === null || charge === void 0 ? void 0 : charge.metadata) === null || _a === void 0 ? void 0 : _a.templateId) &&
                            Boolean(parseInt(charge.metadata.isRoomPurchase, 10));
                        if (!isTemplateCharge) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.coreService.addTemplateToUser({
                                templateId: charge.metadata.templateId,
                                userId: charge.metadata.userId
                            })];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, this.coreService.updateMonetizationStatistic({
                                period: shared_types_1.MonetizationStatisticPeriods.AllTime,
                                type: shared_types_1.MonetizationStatisticTypes.PurchaseRooms,
                                value: charge.amount
                            })];
                    case 2:
                        _c.sent();
                        return [3 /*break*/, 11];
                    case 3:
                        if (!isTransactionCharge) return [3 /*break*/, 11];
                        return [4 /*yield*/, this.coreService.getUserTemplateById({
                                id: charge.metadata.templateId
                            })];
                    case 4:
                        userTemplate = _c.sent();
                        return [4 /*yield*/, this.coreService.getCommonTemplate({
                                templateId: userTemplate.templateId
                            })];
                    case 5:
                        commonTemplate = _c.sent();
                        return [4 /*yield*/, this.coreService.updateRoomRatingStatistic({
                                templateId: commonTemplate.id,
                                ratingKey: 'money',
                                value: charge.amount
                            })];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, this.coreService.updateRoomRatingStatistic({
                                templateId: commonTemplate.id,
                                ratingKey: 'transactions',
                                value: 1
                            })];
                    case 7:
                        _c.sent();
                        return [4 /*yield*/, this.coreService.updateMonetizationStatistic({
                                period: shared_types_1.MonetizationStatisticPeriods.AllTime,
                                type: shared_types_1.MonetizationStatisticTypes.RoomTransactions,
                                value: charge.amount
                            })];
                    case 8:
                        _c.sent();
                        return [4 /*yield*/, this.coreService.findUser({
                                stripeAccountId: (_b = charge.transfer_data) === null || _b === void 0 ? void 0 : _b.destination
                            })];
                    case 9:
                        transferUser = _c.sent();
                        return [4 /*yield*/, this.coreService.updateUserProfileStatistic({
                                userId: transferUser.id,
                                statisticKey: 'moneyEarned',
                                value: charge.amount
                            })];
                    case 10:
                        _c.sent();
                        _c.label = 11;
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    PaymentsController.prototype.handleTrialWillEnd = function (subscription) {
        return __awaiter(this, void 0, void 0, function () {
            var user, frontendUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.coreService.findUser({
                            stripeSubscriptionId: subscription.id
                        })];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, this.configService.get('frontendUrl')];
                    case 2:
                        frontendUrl = _a.sent();
                        this.notificationsService.sendEmail({
                            template: {
                                key: shared_const_2.emailTemplates.trialExpires,
                                data: [
                                    {
                                        name: 'USERNAME',
                                        content: user.fullName
                                    },
                                    {
                                        name: 'PROFILELINK',
                                        content: "".concat(frontendUrl, "/dashboard/profile#subscriptions")
                                    },
                                ]
                            },
                            to: [{ email: user.email, name: user.fullName }]
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    var PaymentsController_1;
    __decorate([
        (0, common_1.Post)('/webhook'),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Request)()),
        __param(2, (0, common_1.Response)())
    ], PaymentsController.prototype, "webhookHandler");
    __decorate([
        (0, common_1.Post)('/express-webhook'),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Request)()),
        __param(2, (0, common_1.Response)())
    ], PaymentsController.prototype, "expressWebhookHandler");
    __decorate([
        (0, microservices_1.MessagePattern)({ cmd: shared_const_1.PaymentsBrokerPatterns.CreateStripeExpressAccount }),
        __param(0, (0, microservices_1.Payload)())
    ], PaymentsController.prototype, "createStripeExpressAccount");
    __decorate([
        (0, microservices_1.MessagePattern)({ cmd: shared_const_1.PaymentsBrokerPatterns.CreateStripeAccountLink }),
        __param(0, (0, microservices_1.Payload)())
    ], PaymentsController.prototype, "createStripeAccountLink");
    __decorate([
        (0, microservices_1.MessagePattern)({ cmd: shared_const_1.PaymentsBrokerPatterns.LoginStripeExpressAccount }),
        __param(0, (0, microservices_1.Payload)())
    ], PaymentsController.prototype, "loginStripeExpressAccount");
    __decorate([
        (0, microservices_1.MessagePattern)({ cmd: shared_const_1.PaymentsBrokerPatterns.DeleteStripeExpressAccount }),
        __param(0, (0, microservices_1.Payload)())
    ], PaymentsController.prototype, "deleteStripeExpressAccount");
    __decorate([
        (0, microservices_1.MessagePattern)({ cmd: shared_const_1.PaymentsBrokerPatterns.CreatePaymentIntent }),
        __param(0, (0, microservices_1.Payload)())
    ], PaymentsController.prototype, "createPaymentIntent");
    __decorate([
        (0, microservices_1.MessagePattern)({ cmd: shared_const_1.PaymentsBrokerPatterns.CancelPaymentIntent }),
        __param(0, (0, microservices_1.Payload)())
    ], PaymentsController.prototype, "cancelPaymentIntent");
    __decorate([
        (0, microservices_1.MessagePattern)({ cmd: shared_const_1.PaymentsBrokerPatterns.GetStripeTemplateProducts })
    ], PaymentsController.prototype, "getStripeTemplatesProducts");
    __decorate([
        (0, microservices_1.MessagePattern)({ cmd: shared_const_1.PaymentsBrokerPatterns.GetStripeSubscriptionProducts })
    ], PaymentsController.prototype, "getStripeSubscriptionsProducts");
    __decorate([
        (0, microservices_1.MessagePattern)({ cmd: shared_const_1.PaymentsBrokerPatterns.GetStripeCheckoutSession }),
        __param(0, (0, microservices_1.Payload)())
    ], PaymentsController.prototype, "getStripeCheckoutSession");
    __decorate([
        (0, microservices_1.MessagePattern)({ cmd: shared_const_1.PaymentsBrokerPatterns.GetStripePortalSession }),
        __param(0, (0, microservices_1.Payload)())
    ], PaymentsController.prototype, "getStripePortalSession");
    __decorate([
        (0, microservices_1.MessagePattern)({ cmd: shared_const_1.PaymentsBrokerPatterns.GetStripeSubscription }),
        __param(0, (0, microservices_1.Payload)())
    ], PaymentsController.prototype, "getStripeSubscription");
    __decorate([
        (0, microservices_1.MessagePattern)({ cmd: shared_const_1.PaymentsBrokerPatterns.CreateStripeTemplateProduct }),
        __param(0, (0, microservices_1.Payload)())
    ], PaymentsController.prototype, "createTemplateStripeProduct");
    __decorate([
        (0, microservices_1.MessagePattern)({ cmd: shared_const_1.PaymentsBrokerPatterns.GetStripeTemplateProduct }),
        __param(0, (0, microservices_1.Payload)())
    ], PaymentsController.prototype, "getTemplateStripeProduct");
    __decorate([
        (0, microservices_1.MessagePattern)({
            cmd: shared_const_1.PaymentsBrokerPatterns.GetStripeTemplateProductByName
        }),
        __param(0, (0, microservices_1.Payload)())
    ], PaymentsController.prototype, "getTemplateStripeProductByName");
    __decorate([
        (0, microservices_1.MessagePattern)({
            cmd: shared_const_1.PaymentsBrokerPatterns.UpdateStripeTemplateProduct
        }),
        __param(0, (0, microservices_1.Payload)())
    ], PaymentsController.prototype, "updateStripeTemplateProduct");
    __decorate([
        (0, microservices_1.MessagePattern)({
            cmd: shared_const_1.PaymentsBrokerPatterns.DeleteTemplateStripeProduct
        }),
        __param(0, (0, microservices_1.Payload)())
    ], PaymentsController.prototype, "deleteTemplateStripeProduct");
    __decorate([
        (0, microservices_1.MessagePattern)({
            cmd: shared_const_1.PaymentsBrokerPatterns.CancelUserSubscription
        }),
        __param(0, (0, microservices_1.Payload)())
    ], PaymentsController.prototype, "cancelUserSubscription");
    __decorate([
        (0, microservices_1.MessagePattern)({
            cmd: shared_const_1.PaymentsBrokerPatterns.GetStripeProductCheckoutSession
        }),
        __param(0, (0, microservices_1.Payload)())
    ], PaymentsController.prototype, "getProductCheckoutSession");
    __decorate([
        (0, microservices_1.MessagePattern)({
            cmd: shared_const_1.PaymentsBrokerPatterns.GetStripeCharges
        }),
        __param(0, (0, microservices_1.Payload)())
    ], PaymentsController.prototype, "getStripeCharges");
    PaymentsController = PaymentsController_1 = __decorate([
        (0, common_1.Controller)(shared_const_2.PAYMENTS_SCOPE)
    ], PaymentsController);
    return PaymentsController;
}());
exports.PaymentsController = PaymentsController;
