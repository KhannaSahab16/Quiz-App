const nodemailer = require('nodemailer');

const sendQuizReportEmail = async (toEmail, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, 
  }
});

    await transporter.sendMail({
      from: '"Quiz Platform" <no-reply@quizapp.com>',
      to: toEmail,
      subject,
      html: htmlContent,
    });
  } catch (error) {
    console.error("❌ Failed to send email:", error.message);
  }
};

module.exports = sendQuizReportEmail;
