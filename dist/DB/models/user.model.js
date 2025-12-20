"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.userSchema = exports.roleEnum = exports.GenderEnum = void 0;
const mongoose_1 = require("mongoose");
var GenderEnum;
(function (GenderEnum) {
    GenderEnum["MALE"] = "MALE";
    GenderEnum["FEMALE"] = "FEMALE";
})(GenderEnum || (exports.GenderEnum = GenderEnum = {}));
var roleEnum;
(function (roleEnum) {
    roleEnum["USER"] = "USER";
    roleEnum["ADMIN"] = "ADMIN";
})(roleEnum || (exports.roleEnum = roleEnum = {}));
exports.userSchema = new mongoose_1.Schema({
    firstName: { type: String, required: true, minLength: 2, maxLength: 25 },
    lastName: { type: String, required: true, minLength: 2, maxLength: 25 },
    email: { type: String, required: true, unique: true },
    confirmEmailOTP: String,
    confirmedAt: Date,
    password: { type: String, required: true },
    resetPasswordOTP: String,
    phone: String,
    address: String,
    gender: {
        type: String,
        enum: Object.values(GenderEnum),
        default: GenderEnum.MALE,
    },
    role: {
        type: String,
        enum: Object.values(roleEnum),
        default: roleEnum.USER,
    },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
exports.userSchema.virtual("username").set(function (value) {
    const [firstName, lastName] = value.split(" ") || [];
    this.set({ firstName, lastName });
}).get((function () {
    return `${this.firstName}  ${this.lastName}`;
}));
exports.UserModel = mongoose_1.models.User || (0, mongoose_1.model)("User", exports.userSchema);
