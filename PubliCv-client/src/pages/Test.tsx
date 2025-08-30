// pages/Test.tsx
import React from "react";
import AuthServices from "../services/auth.ts";
import FileServices from "../services/file.ts";
import type { RegisterDto } from "../dtos/register-dto";
import type { LoginDto } from "../dtos/login-dto";

function Test() {
    const handleRegister = () => {
        const dto: RegisterDto = {
            userName: "Cafeeer",
            email: "celal.evrenuz@hotmail.com",
            password: "Lenovo56_asus",
        };

        AuthServices.registerUser(dto).then((response) => {
            alert("Register Response: " + response.data);
        });
    };

    const handleLogin = () => {
        const dto: LoginDto = {
            email: "testuser@example.com", // same as register
            password: "TestPassword123",
        };

        AuthServices.loginUser(dto).then((response) => {
            alert("Login Response: " + response.data);
        });
    };

    const handleLogout = () => {
        AuthServices.logoutUser().then((response) => {
            console.log("Logout Response:", response);
            alert("Logout Response: " + response);
        });
    };

    const handleForgotPassword = () => {
        AuthServices.forgotPassword("celal.evrenuz@hotmail.com").then(
            (response) => {
                alert("Forgot Password Response: " + response.data);
            }
        );
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            alert("Only PDF files are allowed.");
            return;
        }

        if (file.size > 50 * 1024 * 1024) {
            alert("File size must be less than 50MB.");
            return;
        }

        try {
            const response = await FileServices.uploadFile(file);
            alert(response.data);
        } catch (error: any) {
            console.error("Upload error:", error);
            alert("Upload failed: " + error.message);
        }
    };



    return (
        <div>
            <button onClick={handleRegister}>Register User</button>
            <button onClick={handleLogin}>Login User</button>
            <button onClick={handleLogout}>Logout User</button>
            <button onClick={handleForgotPassword}>Forgot Password</button>

            <hr />

            <input type="file" accept="application/pdf" onChange={handleUpload} />
        </div>
    );
}

export default Test;
