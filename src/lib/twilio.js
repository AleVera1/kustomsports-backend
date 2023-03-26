import twilio from "twilio";
import logger from "../loggers/Log4jsLogger.js"

const sendSMS = async (req, message) => {
  const accountSid = process.env.TWILIOSSID;
  const authToken = process.env.TWILIOAUTH;
  
  const client = twilio(accountSid, authToken);

  const options = {
      body: message,
      from: "+14406888709",
      to: req.user.phone,
    };
    
    try {
      const message = await client.messages.create(options);
    } catch (err) {
      logger.warn(err);
    } 
};

export default sendSMS;