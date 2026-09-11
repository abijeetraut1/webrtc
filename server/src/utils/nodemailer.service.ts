import nodemailer from 'nodemailer';
import { envConfig } from '../config/enviroment.config';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "bebishnewar@gmail.com",
    pass: "jbga pojs mond gyrj",
  },
});

interface SendMailData {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export const sendMail = async ({ to, subject, text }: SendMailData) => {
  try {
    const info = await transporter.sendMail({
      from: envConfig.NODEMAILER_GMAIL_EMAIL,
      to,
      subject,
      text,
    //   html,
    });

    return info;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};