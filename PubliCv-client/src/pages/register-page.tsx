import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./register-page.css";
import SvgLogo from "../../public/PubliCvLogo.svg";
import { Eye, EyeOff } from "lucide-react";
import AuthServices from "../services/auth.ts";
import Toast from "../components/toast.tsx";
import type { RegisterDto } from "../dtos/register-dto";

const RegisterPage = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [toast, setToast] = useState<{ message: string; isPositive: boolean } | null>(null);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isLengthValid = password.length >= 8 && password.length <= 40;
    const isMatch = password === confirmPassword && password.length > 0;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!username || !isValidEmail || !isLengthValid || !isMatch) return;

        setLoading(true);

        const dto: RegisterDto = {
            userName: username,
            email,
            password
        };

        try {
            const response = await AuthServices.registerUser(dto);

            if (response.status >= 200 && response.status < 300) {
                // success
                setSuccess(true);
                alert("Account created successfully! 🎉");
            } else if (response.status === 409) {
                // conflict: user already exists
                setToast({ message: "User with the same username or email already exists.", isPositive: true });
            } else {
                // other errors
                setToast({ message: response.data || "Something went wrong. Please try again.", isPositive: false });
            }
        } catch (error: any) {
            console.error(error);
            setToast({ message: error?.message || "Something went wrong. Please try again.", isPositive: false });
        } finally {
            setLoading(false);
            // remove toast after 4 seconds
            setTimeout(() => setToast(null), 4000);
        }
    };

    return (
        <div className="register-page-container">
            <div className="middle">
                <img className="logo" src={SvgLogo} alt="logo" />

                {toast && <Toast message={toast.message} isPositive={toast.isPositive} />}

                {success ? (
                    <div style={{ textAlign: "center" }}>
                        <h2>Account created successfully 🎉</h2>
                        <p>
                            You can now{" "}
                            <Link to="/login" style={{ color: "#0a1d49", fontWeight: 600 }}>
                                login
                            </Link>{" "}
                            with your new account.
                        </p>
                    </div>
                ) : (
                    <>
                    <form onSubmit={handleSubmit} style={{ width: "100%" }} noValidate>
                        {/* Username */}
                        <div className="input-field">
                            <label htmlFor="username">Username</label>
                            <div className="password-input-wrapper">
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            {!username && <span>Username is required</span>}
                        </div>

                        {/* Email */}
                        <div className="input-field">
                            <label htmlFor="email">Email Address</label>
                            <div className="password-input-wrapper">
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    maxLength={255}
                                />
                            </div>
                            {email && !isValidEmail && <span>Enter a valid email</span>}
                        </div>

                        {/* Password */}
                        <div className="input-field">
                            <label htmlFor="password">Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    maxLength={40}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <span
                                    className="toggle-visibility"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </span>
                            </div>
                            {password && !isLengthValid && <span>Password must be 8–40 characters</span>}
                        </div>

                        {/* Confirm Password */}
                        <div className="input-field">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    maxLength={40}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <span
                                    className="toggle-visibility"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </span>
                            </div>
                            {confirmPassword && !isMatch && <span>Passwords must match</span>}
                        </div>

                        <button
                            type="submit"
                            className="register-button"
                            disabled={!username || !isValidEmail || !isLengthValid || !isMatch || loading}
                        >
                            {loading ? "Registering..." : "Register"}
                        </button>
                    </form>
                {/* Bottom login link */}
                    <div style={{ marginTop: "1rem", textAlign: "center", fontSize: "0.9rem" }}>
                Already have an account?{" "}
                <Link to="/login" style={{ fontWeight: "bold", color: "#0a1d49" }}>
                    Log in
                </Link>
                    </div>
                    </>

            )}
            </div>
        </div>
    );
};

export default RegisterPage;
