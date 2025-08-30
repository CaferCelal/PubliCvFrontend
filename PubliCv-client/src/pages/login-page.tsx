import React, { useState } from "react";
import "./login-page.css";
import SvgLogo from "../../public/PubliCvLogo.svg";
import AuthServices from "../services/auth.ts";
import Toast from "../components/toast.tsx";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; isPositive: boolean } | null>(null);
    const navigate = useNavigate();

    const navigateToForgotPassword = () =>{
        navigate("/forgot-password")
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent default browser reload
        if (!email || !password) return; // extra safety

        setLoading(true);
        try {
            const response = await AuthServices.loginUser({ email, password });

            // If the response is a success, show positive toast
            setToast({ message: response.data, isPositive: true });
        } catch (error: any) {
            console.error(error);

            // If there was an error, show negative toast
            let message = "Something went wrong. Please try again.";
            if (error?.data) message = error.data; // optional: use API error message if provided
            setToast({ message, isPositive: false });
        } finally {
            setLoading(false);

            // Hide toast after 3s
            setTimeout(() => setToast(null), 3000);
        }
    };

    return (
        <div className="login-page-container">
            <div className="middle">
                <img className="logo" src={SvgLogo} alt="logo" />

                <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                    <div className="input-field">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            maxLength={255}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-field">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            maxLength={40}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div
                        className="bottom"
                        style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                    >
                        <span onClick={navigateToForgotPassword} className="forgot-password">Forgot your password?</span>
                        <button type="submit" className="login-button" disabled={loading}>
                            {loading ? "Logging in..." : "Log in"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Toast */}
            {toast && <Toast message={toast.message} isPositive={toast.isPositive} />}
        </div>
    );
};

export default LoginPage;
