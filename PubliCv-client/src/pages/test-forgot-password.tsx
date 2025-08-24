// pages/test-forgot-password.tsx

import React from "react";
import { useLocation } from "react-router-dom";
import AuthServices from "../services/auth.ts";
import type { ResetPasswordWithTokenDto } from "../dtos/reset-password-with-token-dto";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function TestForgotPassword() {
    const query = useQuery();
    const token = query.get("token") || "";
    const email = query.get("email") || "";

    const handleResetPassword = () => {
        const dto: ResetPasswordWithTokenDto = {
            token,
            email,
            newPassword: "NewHardcodedPassword1234", // hardcoded for now
        };

        AuthServices.resetPasswordWithToken(dto).then((response) => {
            alert("Reset Password Response: " + response.data);
        });
    };

    return (
        <div>
            <h2>Reset Password Test</h2>
            <p>Token: {token}</p>
            <p>Email: {email}</p>
            <button onClick={handleResetPassword}>Reset Password</button>
        </div>
    );
}

export default TestForgotPassword;
