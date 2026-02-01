"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.userSchema = exports.roleEnum = exports.GenderEnum = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const hash_1 = require("../../Utils/security/hash");
const event_email_1 = require("../../Utils/events/event.email");
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
    slug: { type: String, required: true, minLength: 2, maxLength: 51 },
    friends: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }],
    email: { type: String, required: true, unique: true },
    confirmEmailOTP: String,
    confirmedAt: Date,
    password: { type: String, required: true },
    resetPasswordOTP: String,
    phone: String,
    address: String,
    profileImage: String,
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
    frozenAt: {
        type: Date,
        default: null
    },
    changeCredintionalDate: {
        type: Date,
        default: null
    },
    frozenBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
exports.userSchema.virtual("username").set(function (value) {
    const [firstName, lastName] = value.split(" ") || [];
    this.set({ firstName, lastName, slug: value.replaceAll(/\s+/g, "-") });
}).get((function () {
    return `${this.firstName}  ${this.lastName}`;
}));
exports.userSchema.pre("save", async function (next) {
    this.wasNew = this.isNew;
    if (this.isModified("password")) {
        this.password = await (0, hash_1.generateHash)(this.password);
    }
    if (this.isModified("confirmEmailOTP")) {
        this.confirmEmailPlain = this.confirmEmailOTP;
        this.confirmEmailOTP = await (0, hash_1.generateHash)(this.confirmEmailOTP);
    }
});
exports.userSchema.post("save", async function (doc) {
    const that = doc;
    if (that.wasNew && that.confirmEmailPlain) {
        event_email_1.emailEvents.emit("confirmEmail", {
            to: that.email,
            username: that.username,
            otp: that.confirmEmailPlain
        });
    }
});
exports.UserModel = mongoose_1.models.User || (0, mongoose_1.model)("User", exports.userSchema);
