"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRepositry = void 0;
const database_repositry_1 = require("./database.repositry");
class postRepositry extends database_repositry_1.DatabaseRepository {
    model;
    constructor(model) {
        super(model);
        this.model = model;
    }
}
exports.postRepositry = postRepositry;
