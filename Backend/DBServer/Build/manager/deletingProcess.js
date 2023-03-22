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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletingProcess = void 0;
const dbManager_js_1 = require("./dbManager.js");
//scans the dbUsersMaster database for users that have been inactive for an hour and deletes them
function deletingProcess() {
    return __awaiter(this, void 0, void 0, function* () {
        setInterval(() => __awaiter(this, void 0, void 0, function* () {
            const expired = yield (0, dbManager_js_1.getExpired)();
            for (let e of expired) {
                console.log("Deleting : ", e);
                (0, dbManager_js_1.deleteUserPartitions)(e['userid'], e['dbsUsed'], e['serverid']);
                (0, dbManager_js_1.deleteUser)(e["userid"]);
            }
        }), 30000);
    });
}
exports.deletingProcess = deletingProcess;
