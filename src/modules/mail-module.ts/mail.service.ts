import nodemailer from "nodemailer";

export class MailService {
  private transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  async sendOtpMail(to: string, otp: string) {
    const mail = await this.transporter.sendMail({
      from: "saad.nadeem@geniuslogix.com",
      to: to,
      subject: "Your OTP to reset password",
      html: `
         <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2>Password Reset OTP</h2>

      <p>Hello,</p>

      <p>
        We received a request to reset your password.
        Use the OTP below to continue:
      </p>

      <div
        style="
          margin: 20px 0;
          padding: 12px 20px;
          background-color: #f4f4f4;
          display: inline-block;
          font-size: 24px;
          font-weight: bold;
          letter-spacing: 4px;
          border-radius: 6px;
        "
      >
        ${otp}
      </div>

      <p>
        This OTP will expire in <strong>5 minutes</strong>.
      </p>

      <p>
        If you did not request a password reset, you can ignore this email.
      </p>

      <br />

      <p>Regards,</p>
      <p>Infobyne Ltd.</p>
    </div>
        `,
    });

    return mail.response;
  }
}
