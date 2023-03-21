"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
function requestLogger(req, res, next) {
    /////////
    console.log("body", req.body);
    console.log("headers", req.headers);
    console.log("params", req.params);
    console.log("query", req.query);
    next();
}
exports.requestLogger = requestLogger;
