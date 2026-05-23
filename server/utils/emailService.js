const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport(
  process.env.EMAIL_HOST
    ? {
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_PORT === '465',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        }
      }
    : {
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        }
      }
);

const FROM = `"LearnTrack" <${process.env.EMAIL_USER}>`;
const CLIENT_URL = 'http://localhost:5173';

const baseStyle = `
  body { font-family: Arial, sans-serif; background: #f3f4f6; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
  .header { background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 40px; text-align: center; }
  .header h1 { color: white; margin: 0; font-size: 28px; }
  .header p { color: rgba(255,255,255,0.8); margin: 8px 0 0; }
  .body { padding: 40px; }
  .body h2 { color: #1f2937; font-size: 22px; margin-bottom: 16px; }
  .body p { color: #6b7280; line-height: 1.6; }
  .btn { display: inline-block; background: #2563eb; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 24px; }
  .footer { background: #f9fafb; padding: 24px 40px; text-align: center; border-top: 1px solid #e5e7eb; }
  .footer p { color: #9ca3af; font-size: 13px; margin: 0; }
`;

function wrapHtml(bodyContent) {
  return `
    <!DOCTYPE html>
    <html>
    <head><style>${baseStyle}</style></head>
    <body>
      <div class="container">
        <div class="header">
          <h1>LearnTrack</h1>
          <p>Your Personal Learning Tracker</p>
        </div>
        <div class="body">
          ${bodyContent}
        </div>
        <div class="footer">
          <p>© 2026 LearnTrack — All rights reserved</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Send Certificate Email
exports.sendCertificateEmail = async (userEmail, userName, trackName, fieldName) => {
  try {
    await transporter.sendMail({
      from: FROM,
      to: userEmail,
      subject: `Congratulations! Your Certificate is Ready — ${trackName}`,
      html: wrapHtml(`
        <span style="display:inline-block;background:#dcfce7;color:#15803d;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-bottom:16px;">Certificate Ready</span>
        <h2>Congratulations, ${userName}!</h2>
        <p>You have successfully completed all lectures and passed the quiz for:</p>
        <div style="background:#eff6ff;border-left:4px solid #2563eb;padding:16px;border-radius:8px;margin:24px 0;">
          <p style="color:#1e40af;margin:0;font-weight:600;">${trackName} — ${fieldName}</p>
        </div>
        <p>Your certificate of completion has been generated. Login to LearnTrack to view and download your certificate.</p>
        <a href="${CLIENT_URL}/dashboard" class="btn">View Certificate</a>
      `)
    });
    console.log('Certificate email sent to:', userEmail);
  } catch (error) {
    console.log('Email error:', error.message);
  }
};

// Send Welcome Email
exports.sendWelcomeEmail = async (userEmail, userName) => {
  try {
    await transporter.sendMail({
      from: FROM,
      to: userEmail,
      subject: 'Welcome to LearnTrack!',
      html: wrapHtml(`
        <h2>Welcome, ${userName}!</h2>
        <p>Thank you for joining LearnTrack. You are now ready to start your learning journey!</p>
        <div style="margin:24px 0;">
          <div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid #f3f4f6;">
            <div style="width:36px;height:36px;background:#eff6ff;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#2563eb;font-weight:bold;">1</div>
            <p style="margin:0;color:#374151;">Choose your learning field — Web Dev, Cyber Security, AI and more</p>
          </div>
          <div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid #f3f4f6;">
            <div style="width:36px;height:36px;background:#eff6ff;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#2563eb;font-weight:bold;">2</div>
            <p style="margin:0;color:#374151;">Follow structured roadmaps step by step</p>
          </div>
          <div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid #f3f4f6;">
            <div style="width:36px;height:36px;background:#eff6ff;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#2563eb;font-weight:bold;">3</div>
            <p style="margin:0;color:#374151;">Complete courses and track your progress</p>
          </div>
          <div style="display:flex;align-items:center;gap:12px;padding:12px 0;">
            <div style="width:36px;height:36px;background:#eff6ff;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#2563eb;font-weight:bold;">4</div>
            <p style="margin:0;color:#374151;">Take quizzes and earn certificates</p>
          </div>
        </div>
        <a href="${CLIENT_URL}/dashboard" class="btn">Start Learning</a>
      `)
    });
    console.log('Welcome email sent to:', userEmail);
  } catch (error) {
    console.log('Email error:', error.message);
  }
};

// Send Email Verification Email
exports.sendVerificationEmail = async (userEmail, userName, token) => {
  try {
    const url = `${CLIENT_URL}/verify-email?token=${token}`;
    await transporter.sendMail({
      from: FROM,
      to: userEmail,
      subject: 'Verify Your Email — LearnTrack',
      html: wrapHtml(`
        <span style="display:inline-block;background:#fef3c7;color:#92400e;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-bottom:16px;">Email Verification</span>
        <h2>Hi ${userName}!</h2>
        <p>Thank you for creating an account with LearnTrack. Please verify your email address by clicking the button below:</p>
        <a href="${url}" class="btn">Verify Email Address</a>
        <p style="margin-top:24px;font-size:13px;color:#9ca3af;">This link will expire in 24 hours. If you did not create an account, you can ignore this email.</p>
      `)
    });
    console.log('Verification email sent to:', userEmail);
  } catch (error) {
    console.log('Email error:', error.message);
  }
};

// Send Password Reset Email
exports.sendResetPasswordEmail = async (userEmail, userName, token) => {
  try {
    const url = `${CLIENT_URL}/reset-password?token=${token}`;
    await transporter.sendMail({
      from: FROM,
      to: userEmail,
      subject: 'Reset Your Password — LearnTrack',
      html: wrapHtml(`
        <span style="display:inline-block;background:#fef3c7;color:#92400e;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:600;margin-bottom:16px;">Password Reset</span>
        <h2>Hi ${userName}!</h2>
        <p>You requested a password reset. Click the button below to set a new password:</p>
        <a href="${url}" class="btn">Reset Password</a>
        <p style="margin-top:24px;font-size:13px;color:#9ca3af;">This link will expire in 1 hour. If you did not request a password reset, you can ignore this email.</p>
      `)
    });
    console.log('Reset email sent to:', userEmail);
  } catch (error) {
    console.log('Email error:', error.message);
  }
};
