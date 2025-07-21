import nodemailer from "nodemailer";
import chalk from "chalk";

import { EMAIL, PASSWORD, SERVER_URL } from "../config/env.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL,
    pass: PASSWORD,
  },
});

const sendEmail = async (email, token) => {
  const emailData = {
    from: EMAIL,
    to: email,
    subject: "Account activation link",
    html: `
        <h3>Please Click on Link to Activate:</h3>
        <p>The token will expire after <b>10 minutes</b></p>
        <p>${SERVER_URL}/api/v1/users/activate/${token}</p>
    `,
  };

  transporter.verify((err, success) => {
    if (err) return console.log(`Veryfing mail ${chalk.red("error")}: ${err}`);
    console.log(`Server is ${chalk.green("ready")} to send email`);
  });

  transporter.sendMail(emailData, (err, info) => {
    if (err) return console.log(`Veryfing mail ${chalk.red("error")}: ${err}`);

    console.log(
      `Email ${chalk.green(" successfully")} sent to ${info.accepted[0]}`
    );
  });
};

export default sendEmail;
