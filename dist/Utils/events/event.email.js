"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailEvents = void 0;
const node_events_1 = require("node:events");
const verify_email_teplete_1 = require("../email/verify.email.teplete");
const send_email_1 = require("../email/send.email");
exports.emailEvents = new node_events_1.EventEmitter();
exports.emailEvents.on("confirmEmail", async (data) => {
    try {
        data.subject = "Confirm Your Email";
        data.html = (0, verify_email_teplete_1.template)(data.otp, data.username, data.subject);
        await (0, send_email_1.sendEmail)(data);
    }
    catch (error) {
        console.log("Fail to senfd Email", error);
    }
});
