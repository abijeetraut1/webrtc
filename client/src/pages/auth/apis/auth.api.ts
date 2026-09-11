export const authRoutes = {
    authenticated:{
        route: "/get-authenticated",
        method: "POST"
    },
    otpVerification:{
        route: "/otp-verification",
        method: "POST"
    },
    resendOTPVerification:{
        route: "/resend-otp-verification",
        method: "POST"
    }
}