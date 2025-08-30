import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "./reset-password-page.css";
import SvgLogo from "../../public/PubliCvLogo.svg";
import { Check, X } from "lucide-react";
import AuthServices from "../services/auth.ts";
import type { ResetPasswordWithTokenDto } from "../dtos/reset-password-with-token-dto";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const ResetPasswordPage = () => {
    const query = useQuery();
    const token = query.get("token") || "";
    const emailFromUrl = query.get("email") || "";

    const [email] = useState(emailFromUrl);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Password rules
    const isLengthValid = password.length >= 8 && password.length <= 40;
    const isMatch = password === confirmPassword && password.length > 0;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isLengthValid || !isMatch || !token || !email) return;

        setLoading(true);
        setError(null);
        try {
            const dto: ResetPasswordWithTokenDto = {
                token,
                email,
                newPassword: password,
            };

            await AuthServices.resetPasswordWithToken(dto);
            setSuccess(true);
        } catch (err: any) {
            console.error(err);
            let message = "Failed to reset password. Please try again.";
            if (err?.data) message = err.data;
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-password-page-container">
            <div className="middle">
                <img className="logo" src={SvgLogo} alt="logo" />

                {success ? (
                    <div style={{ textAlign: "center" }}>
                        <h2>Password updated successfully ✅</h2>
                        <p>
                            You can now{" "}
                            <Link to="/login" style={{ color: "#0a1d49", fontWeight: 600 }}>
                                login
                            </Link>{" "}
                            with your new password.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                        <div className="rules">
                            <div className={`rule ${isLengthValid ? "ok" : "fail"}`}>
                                {isLengthValid ? <Check size={16} /> : <X size={16} />}
                                <span>Password must be 8-40 characters</span>
                            </div>
                            <div className={`rule ${isMatch ? "ok" : "fail"}`}>
                                {isMatch ? <Check size={16} /> : <X size={16} />}
                                <span>Passwords must match</span>
                            </div>
                        </div>

                        <div className="input-field">
                            <label htmlFor="password">New Password</label>
                            <input
                                type="password"
                                id="password"
                                maxLength={40}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-field">
                            <label htmlFor="confirmPassword">Confirm New Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                maxLength={40}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}

                        <button
                            type="submit"
                            className="reset-button"
                            disabled={!isLengthValid || !isMatch || loading}
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPasswordPage;
