import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service : "gmail",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user:"24bcs147@iiitdwd.ac.in",
    pass: "foounepaqfuyklvu",
  },
});

export default transporter;