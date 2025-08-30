import React, { useState, useEffect } from "react";
import "./forgot-password-page.css";
import SvgLogo from "../../public/PubliCvLogo.svg";
import Toast from "../components/toast.tsx";
import AuthServices from "../services/auth.ts";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [toast, setToast] = useState<{ message: string; isPositive: boolean } | null>(null);
    const [cooldown, setCooldown] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (cooldown > 0) {
            timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [cooldown]);

    const sendResetLink = async () => {
        if (!email) return;

        setLoading(true);
        try {
            const response = await AuthServices.forgotPassword(email);

            // Always show positive toast even if email is not registered
            setToast({
                message: "If an account exists with this email, a reset link has been sent.",
                isPositive: true,
            });

            setSubmitted(true);
            setCooldown(30); // start cooldown
        } catch (error: any) {
            console.error(error);
            // Show negative toast on error
            setToast({
                message: "Something went wrong. Please try again later.",
                isPositive: false,
            });
        } finally {
            setLoading(false);
            setTimeout(() => setToast(null), 3000);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        sendResetLink();
    };

    const handleResend = () => {
        if (cooldown === 0) {
            sendResetLink();
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="middle">
                <img className="logo" src={SvgLogo} alt="logo" />

                {!submitted ? (
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

                        <button type="submit" className="login-button" disabled={loading}>
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>
                ) : (
                    <div className="success-message">
                        <p>Check your email and follow the instructions to reset your password.</p>
                        <span
                            className="resend-link"
                            onClick={handleResend}
                            style={{ cursor: cooldown > 0 ? "not-allowed" : "pointer", opacity: cooldown > 0 ? 0.5 : 1 }}
                        >
                            {cooldown > 0
                                ? `You can request again in ${cooldown}s`
                                : "Didn't get the code?"}
                        </span>
                    </div>
                )}
            </div>

            {/* Toast */}
            {toast && <Toast message={toast.message} isPositive={toast.isPositive} />}
        </div>
    );
};

export default ForgotPasswordPage;
