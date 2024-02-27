"use strict";
exports.__esModule = true;
exports.addHoursCustom = void 0;
var date_fns_1 = require("date-fns");
var addHoursCustom = function (date, value) {
    return (0, date_fns_1.addHours)(date, value);
};
exports.addHoursCustom = addHoursCustom;
