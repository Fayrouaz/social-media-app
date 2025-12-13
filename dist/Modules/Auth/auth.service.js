"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AuthenticiationService {
    constructor() {
    }
    signup = async (req, res) => {
        const { username, email, password, confirmPasword } = req.body;
        console.log({ username, email, password, confirmPasword });
        return res.status(201).json({ message: "Hello from Signup" });
    };
    login = (req, res) => {
        const { email, password } = req.body;
        console.log({ email, password });
        res.status(201).json({ message: "Hello from Login" });
    };
}
exports.default = new AuthenticiationService();
