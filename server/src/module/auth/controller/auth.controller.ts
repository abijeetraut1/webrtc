import { Request, Response, NextFunction } from "express";
import userModel from "../schema/auth.schema";
import { sendMail } from "../../../utils/nodemailer.service";

export const getAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    const {email} = req.body;
    if(!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    const expirationTime = Date.now() + 10 * 60 * 1000;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await userModel.findOne({ where: { email } });
    if(!user){
        await userModel.create({
            email,
            username: email.split("@")[0],
            otp,
            otpExpires: new Date(expirationTime),
        });
    }else{ 
        user.otp = otp;
        user.otpExpires = new Date(expirationTime);
        await user.save();
    }
    
    sendMail({ to: email, subject: "Email Verification", text: `Your OTP is: ${otp}` });

    return res.status(200).json({ message: "OTP sent successfully" });
};

export const verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp } = req.body;
    if(!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await userModel.findOne({ where: { email } });
    if(!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if(user.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    if(user.otpExpires < new Date()) {
        return res.status(400).json({ message: "OTP has expired" });
    }

    user.otp = null;
    user.otpExpires = null;
    await user.save();

    return res.status(200).json({ message: "OTP verified successfully" });
};

export const resendOTP = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    if(!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    const user = await userModel.findOne({ where: { email } });
    if(!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const expirationTime = Date.now() + 10 * 60 * 1000;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpires = new Date(expirationTime);
    await user.save();

    sendMail({ to: email, subject: "Email Verification", text: `Your OTP is: ${otp}` });

    return res.status(200).json({ message: "OTP sent successfully" });
};
