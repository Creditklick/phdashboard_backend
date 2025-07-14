const nodemailer = require('nodemailer');

const sendOtpEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
       host: 'smtp.gmail.com',
      service: 'gmail',
      auth: {
        user: 'nietlab123@gmail.com',
        pass: 'dylmawhwepiqrwku', // Make sure this app password is valid
      },
    });

    const response = await transporter.sendMail({
      from: 'nietlab123@gmail.com',
      to: email,
      subject: 'Your PH Dashboard Login OTP',
      text: `Your OTP is: ${otp}`,
    });

    console.log("Email sent successfully:", response.messageId);
  } catch (error) {
    console.error("Failed to send OTP email:", error);
  }
};

module.exports = { sendOtpEmail };
