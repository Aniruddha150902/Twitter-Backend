import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
// require("dotenv").config();
const ses = new SESClient({});
function SendEmailCommandFunc(
  souceEmail: string,
  destEmail: string,
  message: string
) {
  return new SendEmailCommand({
    Source: souceEmail,
    Destination: {
      ToAddresses: [destEmail],
    },
    Message: {
      Subject: {
        Charset: "UTF-8",
        Data: "OTP for your Login",
      },
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: message,
        },
      },
    },
  });
}
export async function sendEmailToken(email: string, token: string) {
  const message = `Your One Time Password is ${token}`;
  const command = await SendEmailCommandFunc(
    "aniruddhajaganatha@gmail.com",
    email,
    message
  );
  try {
    ses.send(command);
  } catch (e) {
    console.log("error while sending the email: " + e);
    return e;
  }
}
// sendEmailToken("sin@eun.ocm", "8239ue");
