"use strict";
exports.__esModule = true;
exports.sendHttpRequest = void 0;
var axios_1 = require("axios");
var sendHttpRequest = function (args) {
    var url = args.url, method = args.method, data = args.data, params = args.params, headers = args.headers, cancelToken = args.cancelToken, onUploadProgress = args.onUploadProgress, onDownloadProgress = args.onDownloadProgress;
    return (0, axios_1["default"])({
        url: url,
        method: method,
        data: data,
        params: params,
        headers: headers,
        cancelToken: cancelToken,
        onUploadProgress: onUploadProgress,
        onDownloadProgress: onDownloadProgress
    });
};
exports.sendHttpRequest = sendHttpRequest;
