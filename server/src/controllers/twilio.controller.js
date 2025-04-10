import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export const sendMessage = async (req, res) => {
  const { phone, message } = req.body;

  try {
    const result = await client.messages.create({
      from: "whatsapp:+14155238886", // Twilio Sandbox number
      to: `whatsapp:+91${phone}`,
      body: message,
    });

    console.log(result);
    

    res.status(200).json({ success: true, sid: result.sid });
  } catch (err) {
    console.error("Twilio Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};
