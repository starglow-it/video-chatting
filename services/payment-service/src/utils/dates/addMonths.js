"use strict";
exports.__esModule = true;
exports.addMonthsCustom = void 0;
var date_fns_1 = require("date-fns");
var addMonthsCustom = function (date, value) {
    return (0, date_fns_1.addMonths)(date, value);
};
exports.addMonthsCustom = addMonthsCustom;
