import { createTransport } from "nodemailer";
import logger from "../loggers/Log4jsLogger.js";
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const sendMail = async (
  req,
  type = "newUser",
  subject = "Nuevo usuario registrado",
  items
) => {
  const transporter = createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "vicente7@ethereal.email",
      pass: "gs1yRQqhyNqAEAjwHP",
    },
  });

  const adminMail = "aevlanus@gmail.com";

  let mailBody = "";
  switch (type) {
    case "newUser":
      mailBody = `<p>New user with mail:${req.body.username}, name:${req.body.name}, address:${req.body.address}, age:${req.body.age} and phone:${req.body.phone}</p>`;
      break;
    case "purchase":
      mailBody = `<p>New purchase from user ${req.user.username}, details:${items}</p>`;
      break;
  }

  const mailOptions = {
    from: "Node Server",
    to: adminMail,
    subject,
    html: mailBody,
  };

  try {
    transporter.sendMail(mailOptions);
  } catch (err) {
    logger.info("Failed to send mail");
  }
};

export { sendMail };
