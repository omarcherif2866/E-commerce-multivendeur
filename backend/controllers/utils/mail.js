import otpGenerator from 'otp-generator';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

const generatorOTP = () => {
  const OTP = otpGenerator.generate(10, { specialChars: false });
  return OTP;
};

const mailTransport = () =>
  nodemailer.createTransport({
    service: 'smtp.gmail.com',
    port: 587,
    secure: true, // Utilisez une connexion sécurisée (TLS)
    auth: {
      user: 'comar2866@gmail.com',
      pass: 'omar omar',
    },
  });


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.jwt_Secret, {
    expiresIn: "365d",
  });
};

export { generatorOTP, mailTransport, generateToken };