"use strict";
// import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
// import { error } from "console";
// // require("dotenv").config();
// // console.log(process.env.AWS_ACCESS_KEY_ID);
// const ses = new SESClient({ region: "eu-north-1" });
// function SendEmailCommandFunc(
//   souceEmail: string,
//   destEmail: string,
//   message: string
// ) {
//   return new SendEmailCommand({
//     Source: souceEmail,
//     Destination: {
//       ToAddresses: [destEmail],
//     },
//     Message: {
//       Subject: {
//         Charset: "UTF-8",
//         Data: "Twitter Clone Login OTP",
//       },
//       Body: {
//         Text: {
//           Charset: "UTF-8",
//           Data: message,
//         },
//       },
//     },
//   });
// }
// export async function sendEmailToken(email: string, token: string) {
//   const message = `Your One Time Password is ${token}`;
//   const command = await SendEmailCommandFunc(
//     "aniruddhajaganatha@gmail.com",
//     email,
//     message
//   );
//   try {
//     return await ses.send(command);
//   } catch (e) {
//     console.log("error while sending the email: " + e);
//     return error;
//   }
// }
// // sendEmailToken("1rn20cs021.aniruddha@gmail.com", "89293829");
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailToken = void 0;
const console_1 = require("console");
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "aniruddhajaganatha@gmail.com",
        pass: "dcpnlwbfoqzqkijm",
    },
});
function sendEmailToken(email, token) {
    return __awaiter(this, void 0, void 0, function* () {
        const message = `Your One Time Password is ${token}`;
        const options = {
            from: "aniruddhajaganatha@gmail.com",
            to: email,
            subject: "Twitter Clone Login OTP",
            text: message,
        };
        try {
            return transporter.sendMail(options);
        }
        catch (e) {
            console.log("error while sending the email: " + e);
            return console_1.error;
        }
    });
}
exports.sendEmailToken = sendEmailToken;
