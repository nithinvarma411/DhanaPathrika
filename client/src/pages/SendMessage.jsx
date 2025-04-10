import React, { useState } from "react";
import axios from "axios";

const SendMessage = () => {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/v1/twilio/sendtwilio`, {
        phone,
        message,
      });
      console.log(res);
      setStatus("✅ Message sent successfully!");
    } catch (error) {
      console.error("Error:", error);
      setStatus("❌ Failed to send message.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-center mb-4">📤 Send WhatsApp Message</h2>
        <form onSubmit={handleSend} className="space-y-4">
          <input
            type="text"
            placeholder="Recipient WhatsApp number (+91...)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
            required
          />
          <textarea
            placeholder="Your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
            required
          ></textarea>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            Send Message
          </button>
        </form>
        {status && <p className="text-center mt-4">{status}</p>}
      </div>
    </div>
  );
};

export default SendMessage;
