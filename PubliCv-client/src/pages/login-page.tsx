import React from "react";
import "./login-page.css"; // Link the CSS file

const LoginPage = () => {
    return (
        <div className="login-page">
            <div className="login-container">
                <h1 className="login-title">Login</h1>

                <form className="login-form">
                    {/* Email */}
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="you@example.com"
                            className="form-input"
                        />
                    </div>

                    {/* Password */}
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            className="form-input"
                        />
                    </div>

                    <button type="submit" className="submit-button">
                        Sign In
                    </button>
                </form>

                <p className="signup-text">
                    Don’t have an account?{" "}
                    <a href="#" className="signup-link">
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
