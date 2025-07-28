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

const sendEmail = async (data, subject, type) => {
  let html;
  if (type === "activate") {
    html = `
        <h3>Please Click on Link to activate your account</h3>
        <p>The token will expire after <b>10 minutes</b></p>
        <p>${SERVER_URL}/api/v1/users/activate/${data.token}</p>
    `;
  } else if (type === "reset") {
    html = `
        <h3>Please Click on Link to reset the password</h3>
        <p>The token will expire after <b>10 minutes</b></p>
        <p>${SERVER_URL}/api/v1/users/reset-password/${data.token}</p>
    `;
  }

  const emailData = {
    from: EMAIL,
    to: data.email,
    subject,
    html,
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
