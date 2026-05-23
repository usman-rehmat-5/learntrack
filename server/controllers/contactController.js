const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

const FROM = `"LearnTrack Contact" <${process.env.EMAIL_USER}>`;

exports.submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    await transporter.sendMail({
      from: FROM,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Contact Form Submission</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <tr><td style="padding: 8px 12px; border: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Name</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; color: #6b7280;">${name}</td></tr>
            <tr><td style="padding: 8px 12px; border: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Email</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; color: #6b7280;">${email}</td></tr>
            <tr><td style="padding: 8px 12px; border: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Subject</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; color: #6b7280;">${subject}</td></tr>
          </table>
          <div style="margin-top: 16px; padding: 16px; background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
            <h3 style="color: #374151; margin: 0 0 8px;">Message</h3>
            <p style="color: #6b7280; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `
    });

    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact email error:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
};
