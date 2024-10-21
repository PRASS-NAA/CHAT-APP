import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import findConfig from 'find-config';

dotenv.config({ path: findConfig('.env') });
import { VERIFICATION_EMAIL_TEMPLATE } from './emailTemplates.js';

// Create a transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER, 
        pass: process.env.PASS, 
    },
});

// Send mail function
export const sendVerificationEmail = async (email, verificationCode) => {
    const mailOptions = {
        from: '71762231037@cit.edu.in',
        to: email,
        subject: 'Verify Your Email',
        html: VERIFICATION_EMAIL_TEMPLATE.replace('{verificationCode}',verificationCode),
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully', info.response);
    } catch (error) {
        console.log('Error sending email', error);
    }
};
