



const nodemailer = require('nodemailer');

const sendOtpEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465, // use 465 for SSL
      secure: true, // true for 465, false for 587
      auth: {
        user: 'creditklick21@gmail.com',       // ✅ Your full Gmail address
        pass: 'mofkcathxcgocldd',         // ✅ Use App Password (not your Gmail password)
      },
    });

    const mailOptions = {
      from: '"PH Dashboard" <creditklick21@gmail.com>', // ✅ Display name and email
      to: email,
      subject: 'Your PH Dashboard Login OTP',
      text: `Your OTP is: ${otp}`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
          <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <h2 style="color: #333333; text-align: center;">🔐 PH Dashboard Login OTP</h2>
            <p style="color: #555555; font-size: 16px;">Dear User,</p>
            <p style="color: #555555; font-size: 16px;">
              We received a request to log in to your <strong>PH Dashboard</strong> account.
            </p>
            <p style="font-size: 18px; color: #222222;">
              <strong>Your One-Time Password (OTP):</strong>
            </p>
            <div style="text-align: center; margin: 20px 0;">
              <span style="display: inline-block; background-color: #007BFF; color: #ffffff; font-size: 28px; font-weight: bold; padding: 12px 24px; border-radius: 6px;">
                ${otp}
              </span>
            </div>
            <p style="color: #777777; font-size: 14px;">
              This OTP is valid for the next <strong>10 minutes</strong>. Please do not share it with anyone.
            </p>
            <p style="color: #777777; font-size: 14px;">
              If you did not request this login, you can safely ignore this message.
            </p>
            <hr style="margin: 30px 0;">
            <p style="text-align: center; color: #999999; font-size: 12px;">
              © ${new Date().getFullYear()} PH Dashboard • All rights reserved.
            </p>
          </div>
        </div>
      `
    };

    const response = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", response.messageId);
  } catch (error) {
    console.error("❌ Failed to send OTP email:", error);
  }
};

module.exports = { sendOtpEmail };