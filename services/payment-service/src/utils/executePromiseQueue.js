"use strict";
exports.__esModule = true;
exports.executePromiseQueue = void 0;
var executePromiseQueue = function (promiseQueue) {
    return new Promise(function (resolve) {
        var results = [];
        var promise = promiseQueue.reduce(function (prev, task) {
            return prev.then(function (result) {
                results.push(result);
                return task();
            });
        }, Promise.resolve());
        promise.then(function () {
            resolve(results);
        });
    });
};
exports.executePromiseQueue = executePromiseQueue;
