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
const node_util_1 = require("node:util");
const promises_1 = require("node:stream/promises");
(0, dotenv_1.config)({ path: node_path_1.default.resolve("./config/.env.dev") });
const auth_controller_1 = __importDefault(require("./Modules/Auth/auth.controller"));
const error_response_1 = require("./Utils/response/error.response");
const user_controller_1 = __importDefault(require("./Modules/User/user.controller"));
const cinection_1 = __importDefault(require("./DB/cinection"));
const s3_config_1 = require("./Utils/multer/s3.config");
const post_contriller_1 = __importDefault(require("./Modules/Post/post.contriller"));
const gateway_1 = require("./Modules/gateway/gateway");
const createS3WreiteStreamPipe = (0, node_util_1.promisify)(promises_1.pipeline);
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 100,
    limit: 100,
    message: {
        status: 429,
        message: "To Many Requests,Please try again later"
    }
});
const boostrap = async () => {
    const app = (0, express_1.default)();
    const port = Number(process.env.PORT) || 5000;
    await (0, cinection_1.default)();
    app.get("/uploads/pre-signed/*path", async (req, res) => {
        const { path } = req.params;
        const Key = path.join("/");
        const url = await (0, s3_config_1.createGetPresignedURL)({
            Key,
        });
        return res.status(200).json({ message: "Done", url });
    });
    app.get("/uploads/*path", async (req, res) => {
        const { downloadName } = req.query;
        const { path } = req.params;
        const Key = path.join("/");
        const s3Response = await (0, s3_config_1.getFile)({ Key });
        if (!s3Response) {
            throw new error_response_1.BadRequestExpetion("File Not Found ");
        }
        if (downloadName) {
            res.setHeader("Content-Dispostion", `attachment; filename="${downloadName}"`);
        }
        res.setHeader("Content-Type", s3Response.ContentType || "application/octet-stream");
        return await createS3WreiteStreamPipe(s3Response.Body.pipe(res));
    });
    app.get("/test-s3", async (req, res) => {
        const { Key } = req.query;
        const results = await (0, s3_config_1.deleteFile)({ Key: Key });
        return res.status(200).json({ message: "Done", results });
    });
    app.get("/test", async (req, res) => {
        const results = await (0, s3_config_1.deleteFiles)({
            urls: ["", "", ""]
        });
        return res.status(200).json({ message: "Done", results });
    });
    app.use((0, cors_1.default)(), express_1.default.json(), (0, helmet_1.default)());
    app.use(limiter);
    app.get("/", (req, res) => {
        res.status(200).json({ message: "Welcome to Social Media app👌" });
    });
    app.use("/api/v1/auth", auth_controller_1.default);
    app.use("/api/post", post_contriller_1.default);
    app.use("/api/v1/user", user_controller_1.default);
    app.use("{/*dummy}", (req, res) => {
        res.status(404).json({ message: "Not Found Handler👨‍🦯" });
    });
    app.use(error_response_1.globalErrorHandler);
    const httpServer = app.listen(port, () => {
        console.log(`Server is Running on http://localhost:${port}🚀`);
    });
    (0, gateway_1.intialize)(httpServer);
};
exports.boostrap = boostrap;
