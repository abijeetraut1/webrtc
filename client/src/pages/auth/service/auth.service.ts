import axiosinstance from "../../../lib/axios.instance";
import { authRoutes } from "../apis/auth.api";

export const getAuthenticated = async (email: string) => {
    try {
        const response = await axiosinstance.post(authRoutes.authenticated.route, {
            email
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching authenticated user:", error);
        throw error;
    }
};

export const verifyOTP = async (otp: string) => {
    try {
        const response = await axiosinstance.post(authRoutes.otpVerification.route, { otp });
        return response.data;
    } catch (error) {
        console.error("Error verifying OTP:", error);
        throw error;
    }
};

export const resendOTP = async (email: string) => {
    try {
        const response = await axiosinstance.post(authRoutes.resendOTPVerification.route, { email });
        return response.data;
    } catch (error) {
        console.error("Error resending OTP:", error);
        throw error;
    }
};