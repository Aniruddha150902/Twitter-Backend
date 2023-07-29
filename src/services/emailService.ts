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

import { error } from "console";
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "aniruddhajaganatha@gmail.com",
    pass: "dcpnlwbfoqzqkijm",
  },
});
export async function sendEmailToken(email: string, token: string) {
  const message = `Your One Time Password is ${token}`;
  const options = {
    from: "aniruddhajaganatha@gmail.com",
    to: email,
    subject: "Twitter Clone Login OTP",
    text: message,
  };
  try {
    return transporter.sendMail(options);
  } catch (e) {
    console.log("error while sending the email: " + e);
    return error;
  }
}
