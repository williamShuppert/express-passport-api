'use strict';
import nodemailer from 'nodemailer';

// will need SMTP service account like Mailgun
// gmail: https://myaccount.google.com/lesssecureapps
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD
    },
    maxConnections: 5,
    maxMessages: 10
});

export default async function sendMail(to, subject, html)
{
    await transporter.sendMail({
        from: process.env.MAIL_USER,
        to,
        subject,
        html,
    });
}