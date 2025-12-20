"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const error_response_1 = require("../../Utils/response/error.response");
const database_repositry_1 = require("./database.repositry");
class UserRepository extends database_repositry_1.DatabaseRepository {
    model;
    constructor(model) {
        super(model);
        this.model = model;
    }
    async createUser({ data = [], options = {} }) {
        const [user] = (await this.create({ data, options })) || [];
        if (!user) {
            throw new error_response_1.BadRequestExpetion("Fail to signup");
        }
        return user;
    }
}
exports.UserRepository = UserRepository;
