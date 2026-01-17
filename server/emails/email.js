import transporter from "./nodemailer.js";
import { PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL } from "./emailTemplates.js";

export const verificationEmail = async (userEmail, code) => {
  try {
    const mailOptions = await transporter.sendMail({
      from: "24bcs147@iiitdwd.ac.in",
      to: userEmail,
      subject: "Email Verification",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", code),
      category: "Email Verification",
    });
    transporter.verify((err) => {
      if (err) {
        console.error("Brevo SMTP ERROR ❌", err);
      } else {
        console.log("Brevo SMTP READY ✅");
      }
    });

    // console.log("Email sent successfully", mailOptions);
  } catch (error) {
    console.log("Error in verification Email : ", error);
  }
};

export const passwordResetEmail = async (url, email) => {
  try {
    const mailOptions = await transporter.sendMail({
      from: "24bcs147@iiitdwd.ac.in",
      to: email,
      subject: "Password Reset Email",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
    });
    console.log("Password Reset Email sent successfully");
  } catch (error) {
    console.log("Error in passwordResetEmail", error);
  }
};

export const passwordResetSuccessEmail = async (email) => {
  try {
    const mailOptions = await transporter.sendMail({
      from : "24bcs147@iiitdwd.ac.in",
      to : email,
      subject : "Password Reset Success Email",
      html : PASSWORD_RESET_SUCCESS_TEMPLATE
    })
    console.log("Email send successfully ")
  } catch (error) {
    console.log("Error in passwrodresetsuccessEmail function : ", error)
  }
}

export const sendWelcomeEmail = async (email, username) => {
  try {
    const mailOptions = await transporter.sendMail({
      from : "24bcs147@iiitdwd.ac.in",
      to : email,
      subject : "Welcome Chatify",
      html : WELCOME_EMAIL.replace("{{name}}", username)  
    })
  } catch (error) {
    
  }
}