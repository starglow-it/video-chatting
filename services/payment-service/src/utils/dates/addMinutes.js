"use strict";
exports.__esModule = true;
exports.addMinutesCustom = void 0;
var date_fns_1 = require("date-fns");
var addMinutesCustom = function (date, value) {
    return (0, date_fns_1.addMinutes)(date, value);
};
exports.addMinutesCustom = addMinutesCustom;
