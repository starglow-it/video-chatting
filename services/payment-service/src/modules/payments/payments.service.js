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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
exports.__esModule = true;
exports.PaymentsService = void 0;
var common_1 = require("@nestjs/common");
var nestjs_stripe_1 = require("nestjs-stripe");
var shared_utils_1 = require("shared-utils");
var PaymentsService = /** @class */ (function () {
    function PaymentsService(configService, stripeClient) {
        this.configService = configService;
        this.stripeClient = stripeClient;
        this.logger = new common_1.Logger(PaymentsService_1.name);
    }
    PaymentsService_1 = PaymentsService;
    PaymentsService.prototype.createExpressAccount = function (_a) {
        var email = _a.email;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2 /*return*/, this.stripeClient.accounts.create({
                        type: 'express',
                        email: email,
                        capabilities: {
                            transfers: {
                                requested: true
                            },
                            card_payments: {
                                requested: true
                            }
                        }
                    })];
            });
        });
    };
    PaymentsService.prototype.createExpressAccountLink = function (_a) {
        var accountId = _a.accountId;
        return __awaiter(this, void 0, void 0, function () {
            var frontendUrl;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.configService.get('frontendUrl')];
                    case 1:
                        frontendUrl = _b.sent();
                        return [2 /*return*/, this.stripeClient.accountLinks.create({
                                account: accountId,
                                refresh_url: "".concat(frontendUrl, "/dashboard/profile"),
                                return_url: "".concat(frontendUrl, "/dashboard/profile"),
                                type: 'account_onboarding'
                            })];
                }
            });
        });
    };
    PaymentsService.prototype.getExpressAccount = function (_a) {
        var accountId = _a.accountId;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2 /*return*/, this.stripeClient.accounts.retrieve(accountId)];
            });
        });
    };
    PaymentsService.prototype.createExpressAccountLoginLink = function (_a) {
        var accountId = _a.accountId;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2 /*return*/, this.stripeClient.accounts.createLoginLink(accountId)];
            });
        });
    };
    PaymentsService.prototype.deleteExpressAccount = function (_a) {
        var accountId = _a.accountId;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2 /*return*/, this.stripeClient.accounts.del(accountId)];
            });
        });
    };
    PaymentsService.prototype.createPaymentIntent = function (_a) {
        var templatePrice = _a.templatePrice, templateCurrency = _a.templateCurrency, stripeAccountId = _a.stripeAccountId, platformFee = _a.platformFee, templateId = _a.templateId;
        return __awaiter(this, void 0, void 0, function () {
            var amount;
            return __generator(this, function (_b) {
                amount = templatePrice * 100;
                return [2 /*return*/, this.stripeClient.paymentIntents.create({
                        amount: amount,
                        currency: templateCurrency,
                        transfer_data: {
                            amount: Math.floor(amount - (amount * platformFee)) || amount,
                            destination: stripeAccountId
                        },
                        metadata: {
                            templateId: templateId,
                            isTransactionCharge: 1
                        }
                    })];
            });
        });
    };
    PaymentsService.prototype.getPaymentIntent = function (_a) {
        var paymentIntentId = _a.paymentIntentId;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2 /*return*/, this.stripeClient.paymentIntents.retrieve(paymentIntentId)];
            });
        });
    };
    PaymentsService.prototype.cancelPaymentIntent = function (_a) {
        var paymentIntentId = _a.paymentIntentId;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2 /*return*/, this.stripeClient.paymentIntents.cancel(paymentIntentId)];
            });
        });
    };
    PaymentsService.prototype.createWebhookEvent = function (_a) {
        var body = _a.body, sig = _a.sig;
        return __awaiter(this, void 0, void 0, function () {
            var secret, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.configService.get('stripeWebhookSecret')];
                    case 1:
                        secret = _b.sent();
                        return [2 /*return*/, this.stripeClient.webhooks.constructEvent(body, sig, secret)];
                    case 2:
                        e_1 = _b.sent();
                        console.log("\u26A0\uFE0F  Webhook signature verification failed.", e_1.message);
                        return [2 /*return*/];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PaymentsService.prototype.createExpressWebhookEvent = function (_a) {
        var body = _a.body, sig = _a.sig;
        return __awaiter(this, void 0, void 0, function () {
            var secret, e_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.configService.get('stripeExpressWebhookSecret')];
                    case 1:
                        secret = _b.sent();
                        return [2 /*return*/, this.stripeClient.webhooks.constructEvent(body, sig, secret)];
                    case 2:
                        e_2 = _b.sent();
                        console.log("\u26A0\uFE0F  Webhook signature verification failed.", e_2.message);
                        return [2 /*return*/];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PaymentsService.prototype.getStripeProducts = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.stripeClient.products.list({
                        active: true
                    })];
            });
        });
    };
    PaymentsService.prototype.getStripeProduct = function (productId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.stripeClient.products.retrieve(productId)];
            });
        });
    };
    PaymentsService.prototype.getStripeCheckoutSession = function (_a) {
        var paymentMode = _a.paymentMode, priceId = _a.priceId, basePath = _a.basePath, cancelPath = _a.cancelPath, meetingToken = _a.meetingToken, customer = _a.customer, customerEmail = _a.customerEmail, trialPeriodEndTimestamp = _a.trialPeriodEndTimestamp, templateId = _a.templateId, userId = _a.userId;
        return __awaiter(this, void 0, void 0, function () {
            var frontendUrl, meetingPath, cancelUrl, successUrl, metadata;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.configService.get('frontendUrl')];
                    case 1:
                        frontendUrl = _b.sent();
                        meetingPath = "/room/".concat(meetingToken);
                        cancelUrl = new URL("".concat(frontendUrl, "/").concat(meetingToken ? meetingPath : cancelPath !== null && cancelPath !== void 0 ? cancelPath : basePath));
                        successUrl = new URL("".concat(frontendUrl, "/").concat(meetingToken ? meetingPath : basePath));
                        cancelUrl.searchParams.set('canceled', 'true');
                        successUrl.searchParams.set('success', 'true');
                        successUrl.searchParams.set('session_id', '{CHECKOUT_SESSION_ID}');
                        metadata = {
                            templateId: templateId,
                            userId: userId,
                            isRoomPurchase: templateId ? 1 : 0,
                            isSubscriptionPurchase: paymentMode === 'subscription' ? 1 : 0
                        };
                        return [2 /*return*/, this.stripeClient.checkout.sessions.create(__assign(__assign(__assign(__assign(__assign(__assign({ billing_address_collection: 'auto', line_items: [
                                    {
                                        price: priceId,
                                        quantity: 1
                                    },
                                ] }, (customer ? { customer: customer } : { customer_email: customerEmail })), { mode: paymentMode, client_reference_id: customer, allow_promotion_codes: true, success_url: successUrl.href, cancel_url: cancelUrl.href }), (paymentMode === 'subscription'
                                ? {
                                    subscription_data: {
                                        trial_period_days: trialPeriodEndTimestamp,
                                        metadata: metadata
                                    }
                                }
                                : {})), (paymentMode === 'subscription'
                                ? {}
                                : {
                                    payment_intent_data: {
                                        metadata: metadata
                                    }
                                })), { metadata: metadata }), (paymentMode === 'subscription'
                                ? { payment_method_collection: 'if_required' }
                                : {})))];
                }
            });
        });
    };
    PaymentsService.prototype.getStripePrice = function (priceId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.stripeClient.prices.retrieve(priceId)];
            });
        });
    };
    PaymentsService.prototype.getSubscription = function (subscriptionId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.stripeClient.subscriptions.retrieve(subscriptionId)];
            });
        });
    };
    PaymentsService.prototype.createSessionPortal = function (customer, returnUrl) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.stripeClient.billingPortal.sessions.create({
                        customer: customer,
                        return_url: returnUrl
                    })];
            });
        });
    };
    PaymentsService.prototype.createProduct = function (productData) {
        return __awaiter(this, void 0, void 0, function () {
            var environment, product;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.configService.get('environment')];
                    case 1:
                        environment = _a.sent();
                        return [4 /*yield*/, this.stripeClient.products.create(__assign({ name: productData.name, active: true, tax_code: 'txcd_10000000', metadata: {
                                    type: productData.type
                                } }, (productData.description && {
                                description: productData.description
                            })))];
                    case 2:
                        product = _a.sent();
                        return [4 /*yield*/, this.stripeClient.prices.create(__assign({ product: product.id, currency: 'usd', unit_amount: productData.priceInCents }, (productData.type === 'subscription'
                                ? {
                                    recurring: {
                                        interval: ['demo', 'production'].includes(environment)
                                            ? 'month'
                                            : 'day'
                                    }
                                }
                                : {})))];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, product];
                }
            });
        });
    };
    PaymentsService.prototype.createCustomer = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.stripeClient.customers.create({
                            email: user.email,
                            name: user.fullName
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PaymentsService.prototype.updateProduct = function (productId, data) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedProduct, price;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.stripeClient.products.update(productId, {
                            name: data.name,
                            description: data.description
                        })];
                    case 1:
                        updatedProduct = _a.sent();
                        if (!data.priceInCents) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.getProductPrice(productId)];
                    case 2:
                        price = _a.sent();
                        return [4 /*yield*/, this.stripeClient.prices.update(price.id, { active: false })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.stripeClient.prices.create({
                                product: productId,
                                currency: 'usd',
                                unit_amount: data.priceInCents
                            })];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/, updatedProduct];
                }
            });
        });
    };
    PaymentsService.prototype.getProduct = function (productId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.stripeClient.products.retrieve(productId)];
            });
        });
    };
    PaymentsService.prototype.getProductPrice = function (productId) {
        return __awaiter(this, void 0, void 0, function () {
            var prices;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.stripeClient.prices.search({
                            query: "product:\"".concat(productId, "\"")
                        })];
                    case 1:
                        prices = _a.sent();
                        return [2 /*return*/, prices.data[0]];
                }
            });
        });
    };
    PaymentsService.prototype.getCustomer = function (_a) {
        var customerId = _a.customerId;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2 /*return*/, this.stripeClient.customers.retrieve(customerId)];
            });
        });
    };
    PaymentsService.prototype.getCheckoutSession = function (checkoutId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.stripeClient.checkout.sessions.retrieve(checkoutId, {
                        expand: ['line_items']
                    })];
            });
        });
    };
    PaymentsService.prototype.getStripeSubscriptions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var allProducts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.stripeClient.products.list({
                            active: true
                        })];
                    case 1:
                        allProducts = _a.sent();
                        return [2 /*return*/, allProducts.data.filter(function (product) { return product.metadata.type === 'subscription'; })];
                }
            });
        });
    };
    PaymentsService.prototype.getStripeTemplates = function () {
        return __awaiter(this, void 0, void 0, function () {
            var allProducts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.stripeClient.products.list({
                            active: true
                        })];
                    case 1:
                        allProducts = _a.sent();
                        return [2 /*return*/, allProducts.data.filter(function (product) { return product.metadata.type === 'template'; })];
                }
            });
        });
    };
    PaymentsService.prototype.cancelStripeSubscription = function (_a) {
        var subscriptionId = _a.subscriptionId;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!subscriptionId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.stripeClient.subscriptions.update(subscriptionId, {
                                cancel_at_period_end: true
                            })];
                    case 1:
                        _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        this.logger.log('[cancelStripeSubscription]: no subscription id was provided');
                        _b.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PaymentsService.prototype.updateSubscription = function (_a) {
        var subscriptionId = _a.subscriptionId, options = _a.options;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2 /*return*/, this.stripeClient.subscriptions.update(subscriptionId, {
                        trial_end: options.trialEnd,
                        cancel_at_period_end: options.cancelAtPeriodEnd
                    })];
            });
        });
    };
    PaymentsService.prototype.getCharges = function (_a) {
        var e_3, _b;
        var time = _a.time;
        return __awaiter(this, void 0, void 0, function () {
            var options, charges, _c, _d, charge, e_3_1;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        options = {
                            limit: 100,
                            created: {
                                gt: Math.floor(time / 1000)
                            }
                        };
                        charges = [];
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 6, 7, 12]);
                        _c = __asyncValues(this.stripeClient.charges.list(options));
                        _e.label = 2;
                    case 2: return [4 /*yield*/, _c.next()];
                    case 3:
                        if (!(_d = _e.sent(), !_d.done)) return [3 /*break*/, 5];
                        charge = _d.value;
                        charges.push(charge);
                        _e.label = 4;
                    case 4: return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 12];
                    case 6:
                        e_3_1 = _e.sent();
                        e_3 = { error: e_3_1 };
                        return [3 /*break*/, 12];
                    case 7:
                        _e.trys.push([7, , 10, 11]);
                        if (!(_d && !_d.done && (_b = _c["return"]))) return [3 /*break*/, 9];
                        return [4 /*yield*/, _b.call(_c)];
                    case 8:
                        _e.sent();
                        _e.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        if (e_3) throw e_3.error;
                        return [7 /*endfinally*/];
                    case 11: return [7 /*endfinally*/];
                    case 12: return [2 /*return*/, charges.reduce(function (acc, chargeAmount) { return acc + chargeAmount; }, 0)];
                }
            });
        });
    };
    PaymentsService.prototype.getSubscriptionCharges = function (_a) {
        var e_4, _b;
        var time = _a.time;
        return __awaiter(this, void 0, void 0, function () {
            var options, paymentIntents, _c, _d, charge, e_4_1;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        options = {
                            limit: 100,
                            created: {
                                gt: Math.floor(time / 1000)
                            }
                        };
                        paymentIntents = [];
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 6, 7, 12]);
                        _c = __asyncValues(this.stripeClient.charges.list(options));
                        _e.label = 2;
                    case 2: return [4 /*yield*/, _c.next()];
                    case 3:
                        if (!(_d = _e.sent(), !_d.done)) return [3 /*break*/, 5];
                        charge = _d.value;
                        if (charge.invoice) {
                            paymentIntents.push(charge.amount);
                        }
                        _e.label = 4;
                    case 4: return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 12];
                    case 6:
                        e_4_1 = _e.sent();
                        e_4 = { error: e_4_1 };
                        return [3 /*break*/, 12];
                    case 7:
                        _e.trys.push([7, , 10, 11]);
                        if (!(_d && !_d.done && (_b = _c["return"]))) return [3 /*break*/, 9];
                        return [4 /*yield*/, _b.call(_c)];
                    case 8:
                        _e.sent();
                        _e.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        if (e_4) throw e_4.error;
                        return [7 /*endfinally*/];
                    case 11: return [7 /*endfinally*/];
                    case 12: return [2 /*return*/, paymentIntents.reduce(function (acc, chargeAmount) { return acc + chargeAmount; }, 0)];
                }
            });
        });
    };
    PaymentsService.prototype.getTransactionsCharges = function (_a) {
        var e_5, _b;
        var _c, _d;
        var time = _a.time;
        return __awaiter(this, void 0, void 0, function () {
            var options, transactionCharges, _e, _f, charge, e_5_1;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        options = {
                            limit: 100,
                            created: {
                                gt: Math.floor(time / 1000)
                            }
                        };
                        transactionCharges = [];
                        _g.label = 1;
                    case 1:
                        _g.trys.push([1, 6, 7, 12]);
                        _e = __asyncValues(this.stripeClient.charges.list(options));
                        _g.label = 2;
                    case 2: return [4 /*yield*/, _e.next()];
                    case 3:
                        if (!(_f = _g.sent(), !_f.done)) return [3 /*break*/, 5];
                        charge = _f.value;
                        if ((Boolean((_c = charge === null || charge === void 0 ? void 0 : charge.transfer_data) === null || _c === void 0 ? void 0 : _c.destination) ||
                            (0, shared_utils_1.parseBoolean)((_d = charge === null || charge === void 0 ? void 0 : charge.metadata) === null || _d === void 0 ? void 0 : _d.isTransactionCharge, false)) &&
                            charge.status === 'succeeded') {
                            transactionCharges.push(charge.amount);
                        }
                        _g.label = 4;
                    case 4: return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 12];
                    case 6:
                        e_5_1 = _g.sent();
                        e_5 = { error: e_5_1 };
                        return [3 /*break*/, 12];
                    case 7:
                        _g.trys.push([7, , 10, 11]);
                        if (!(_f && !_f.done && (_b = _e["return"]))) return [3 /*break*/, 9];
                        return [4 /*yield*/, _b.call(_e)];
                    case 8:
                        _g.sent();
                        _g.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        if (e_5) throw e_5.error;
                        return [7 /*endfinally*/];
                    case 11: return [7 /*endfinally*/];
                    case 12: return [2 /*return*/, transactionCharges.reduce(function (acc, chargeAmount) { return acc + chargeAmount; }, 0)];
                }
            });
        });
    };
    PaymentsService.prototype.getRoomsPurchaseCharges = function (_a) {
        var e_6, _b;
        var _c;
        var time = _a.time;
        return __awaiter(this, void 0, void 0, function () {
            var options, roomPurchaseCharges, _d, _e, charge, e_6_1;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        options = {
                            limit: 100,
                            created: {
                                gt: Math.floor(time / 1000)
                            }
                        };
                        roomPurchaseCharges = [];
                        _f.label = 1;
                    case 1:
                        _f.trys.push([1, 6, 7, 12]);
                        _d = __asyncValues(this.stripeClient.charges.list(options));
                        _f.label = 2;
                    case 2: return [4 /*yield*/, _d.next()];
                    case 3:
                        if (!(_e = _f.sent(), !_e.done)) return [3 /*break*/, 5];
                        charge = _e.value;
                        if ((0, shared_utils_1.parseBoolean)((_c = charge === null || charge === void 0 ? void 0 : charge.metadata) === null || _c === void 0 ? void 0 : _c.isRoomPurchase, false) &&
                            charge.status === 'succeeded') {
                            roomPurchaseCharges.push(charge.amount);
                        }
                        _f.label = 4;
                    case 4: return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 12];
                    case 6:
                        e_6_1 = _f.sent();
                        e_6 = { error: e_6_1 };
                        return [3 /*break*/, 12];
                    case 7:
                        _f.trys.push([7, , 10, 11]);
                        if (!(_e && !_e.done && (_b = _d["return"]))) return [3 /*break*/, 9];
                        return [4 /*yield*/, _b.call(_d)];
                    case 8:
                        _f.sent();
                        _f.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        if (e_6) throw e_6.error;
                        return [7 /*endfinally*/];
                    case 11: return [7 /*endfinally*/];
                    case 12: return [2 /*return*/, roomPurchaseCharges.reduce(function (acc, chargeAmount) { return acc + chargeAmount; }, 0)];
                }
            });
        });
    };
    PaymentsService.prototype.deleteStripeProduct = function (_a) {
        var productId = _a.productId;
        return __awaiter(this, void 0, void 0, function () {
            var e_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 4]);
                        return [4 /*yield*/, this.stripeClient.products.del(productId)];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                    case 2:
                        e_7 = _b.sent();
                        return [4 /*yield*/, this.stripeClient.products.update(productId, { active: false })];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    var PaymentsService_1;
    PaymentsService = PaymentsService_1 = __decorate([
        (0, common_1.Injectable)(),
        __param(1, (0, nestjs_stripe_1.InjectStripe)())
    ], PaymentsService);
    return PaymentsService;
}());
exports.PaymentsService = PaymentsService;
