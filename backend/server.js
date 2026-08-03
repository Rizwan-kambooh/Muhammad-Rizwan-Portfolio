require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();
const PORT = Number(process.env.PORT || 5001);
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "messages.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, "[]", "utf8");
}

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const isProduction = process.env.NODE_ENV === "production";

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || !isProduction || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "10kb" }));

function readMessages() {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    console.error("Unable to read message store:", error.message);
    return [];
  }
}

function writeMessages(messages) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2));
  } catch (error) {
    console.error("Unable to write message store:", error.message);
  }
}

async function sendContactEmail({ name, email, phone, message }) {
  const host = process.env.EMAIL_HOST;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!host || !user || !pass) {
    console.warn("Email credentials are not configured. Skipping email delivery.");
    return false;
  }

  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: { user, pass },
  });

  const mailOptions = {
    from: `"Portfolio Contact Form" <${user}>`,
    to: process.env.EMAIL_TO || user,
    replyTo: email,
    subject: `New portfolio message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`,
    html: `
      <h3>New message from your portfolio website</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br/>")}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
  return true;
}

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Portfolio API is running" });
});

app.post("/api/contact", async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name?.trim() || !email?.trim() || !phone?.trim() || !message?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Please fill in your name, email, phone number, and message.",
    });
  }

  const payload = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    message: message.trim(),
    createdAt: new Date().toISOString(),
  };

  const messages = readMessages();
  messages.unshift(payload);
  writeMessages(messages);

  try {
    const emailSent = await sendContactEmail(payload);
    return res.status(200).json({
      success: true,
      message: emailSent
        ? "Thanks! Your message has been sent successfully."
        : "Your message was saved successfully. Email delivery is not configured yet, so I’ll review it manually.",
      data: payload,
    });
  } catch (error) {
    console.error("Contact email failed:", error.message);
    return res.status(200).json({
      success: true,
      message: "Your message was saved successfully. I’ll review it manually for now.",
      data: payload,
    });
  }
});

app.get("/api/contact/messages", (req, res) => {
  const messages = readMessages().slice(0, 20);
  res.json({ success: true, count: messages.length, data: messages });
});

app.listen(PORT, () => {
  console.log(`Portfolio backend running on http://localhost:${PORT}`);
});
