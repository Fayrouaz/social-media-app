"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRepositry = void 0;
const database_repositry_1 = require("./database.repositry");
class commentRepositry extends database_repositry_1.DatabaseRepository {
    model;
    constructor(model) {
        super(model);
        this.model = model;
    }
}
exports.commentRepositry = commentRepositry;
