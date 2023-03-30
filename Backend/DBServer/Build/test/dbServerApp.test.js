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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const dbServerApp_js_1 = require("../dbServerApp.js");
describe('GET /assignid', () => {
    describe('Given no userid', () => {
        //should return a new valid userid
        //should return status 200
        test("should return a new valid userid", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(dbServerApp_js_1.app).get('/assignid').send();
            const result = yield (0, supertest_1.default)(dbServerApp_js_1.app).get("/assignid");
            expect(response.statusCode).toBe(200);
        }));
    });
    describe('Given a valid userid', () => {
        //should return the same userid
        //should return status 200
    });
    describe('Given an invalid userid', () => {
        //should return a new valid userid
        //should return an error status code???
    });
});
