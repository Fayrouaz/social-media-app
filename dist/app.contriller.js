"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.boostrap = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const node_path_1 = __importDefault(require("node:path"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: node_path_1.default.resolve("./config/.env.dev") });
const auth_controller_1 = __importDefault(require("./Modules/Auth/auth.controller"));
const error_response_1 = require("./Utils/response/error.response");
const user_controller_1 = __importDefault(require("./Modules/User/user.controller"));
const cinection_1 = __importDefault(require("./DB/cinection"));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 100,
    limit: 100,
    message: {
        status: 429,
        message: "To Many Requests,Please try again later"
    }
});
const boostrap = () => {
    const app = (0, express_1.default)();
    const port = Number(process.env.PORT) || 5000;
    app.use((0, cors_1.default)(), express_1.default.json(), (0, helmet_1.default)());
    app.use(limiter);
    (0, cinection_1.default)();
    app.get("/", (req, res) => {
        res.status(200).json({ message: "Welcome to Social Media app👌" });
    });
    app.use("/api/v1/auth", auth_controller_1.default);
    app.use("/api/v1/user", user_controller_1.default);
    app.use("{/*dummy}", (req, res) => {
        res.status(404).json({ message: "Not Found Handler👨‍🦯" });
    });
    app.use(error_response_1.globalErrorHandler);
    app.listen(port, () => {
        console.log(`Server is Running on http://localhost:${port}🚀`);
    });
};
exports.boostrap = boostrap;
