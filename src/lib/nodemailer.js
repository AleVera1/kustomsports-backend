import { createTransport } from "nodemailer";
import logger from "../loggers/Log4jsLogger.js"

const sendMail = async (req, type = "newUser", subject = "Nuevo usuario registrado", items) => {
  const transporter = createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'cornell52@ethereal.email',
        pass: 'tm9KvstEd2AVZraH1N'
    }
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
    };

    const mailOptions = {
    from: "Node Server",
    to: adminMail,
    subject,
    html: mailBody
    };

    try {
    transporter.sendMail(mailOptions);
    }
    catch (err) {
    logger.info("Failed to send mail");
    }
}

export default sendMail;