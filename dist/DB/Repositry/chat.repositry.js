"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRepositry = void 0;
const database_repositry_1 = require("./database.repositry");
class chatRepositry extends database_repositry_1.DatabaseRepository {
    model;
    constructor(model) {
        super(model);
        this.model = model;
    }
}
exports.chatRepositry = chatRepositry;
