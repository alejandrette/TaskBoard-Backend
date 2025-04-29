import { transporter } from "../config/nodemailer";

type sendConfirmationEmailProps = {
  email: string;
  name: string;
  token: string;
}

export class AuthEmail {
  static sendConfirmationEmail = async ({ email, name, token }: sendConfirmationEmailProps) => {
    await transporter.sendMail({
      from: 'TaskBoard 🛠 <admin@taskboard.com>',
      to: email,
      subject: 'Confirm your account at TaskBoard',
      text: `Hello ${name}, please confirm your account at TaskBoard by clicking the following link: `,
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h2 style="color: #4F46E5;">Hello, ${name}!</h2>
          <p>Thank you for registering at <strong>TaskBoard</strong>.</p>
          <p>To activate your account, simply click the link below and enter the token: <strong style="color: #4F46E5;">${token}</strong></p>
          <a href="${process.env.FRONT_URL}/auth/confirm-account?email=${email}" style="display: inline-block; margin-top: 20px; background-color: #4F46E5; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">
            Confirm Account
          </a>
          <p style="margin-top: 20px;">If you did not create this account, you can safely ignore this message.</p>
        </div>
      `
    });
  }
}