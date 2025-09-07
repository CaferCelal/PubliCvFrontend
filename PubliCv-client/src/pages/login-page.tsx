import React, {useState} from "react";
import "./login-page.css";
import SvgLogo from "../../public/PubliCvLogo.svg";
import AuthServices from "../services/auth.ts";
import Toast from "../components/toast.tsx";
import {useNavigate} from "react-router-dom";
import {Eye, EyeOff} from "lucide-react";


const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; isPositive: boolean } | null>(null);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const navigateToForgotPassword = () => {
        navigate("/forgot-password")
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email || !password) return;

        setLoading(true);
        try {
            const response = await AuthServices.loginUser({email, password});

            if (response.status >= 200 && response.status < 300) {
                navigate("/profile");
            } else if (response.status === 401) {
                setToast({message: "Invalid email or password.", isPositive: true});
            }
        } catch (error: any) {
            console.error(error);

            let message = "Something went wrong. Please try again.";
            if (error?.message) message = error.message;
            setToast({message, isPositive: false});
        } finally {
            setLoading(false);
            setTimeout(() => setToast(null), 3000);
        }
    };


    return (
        <div className="login-page-container">
            <div className="middle">
                <img className="logo" src={SvgLogo} alt="logo"/>

                <form onSubmit={handleSubmit} style={{width: "100%"}}>
                    <div className="input-field">
                        <label htmlFor="email">Email</label>
                        <div className="password-input-wrapper">
                            <input
                                type="email"
                                id="email"
                                maxLength={255}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

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
                                {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                            </span>
                        </div>
                    </div>


                    <div
                        className="bottom"
                        style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}
                    >
                        <span onClick={navigateToForgotPassword}
                              className="forgot-password">Forgot your password?</span>
                        <button type="submit" className="login-button" disabled={loading}>
                            {loading ? "Logging in..." : "Log in"}
                        </button>
                    </div>
                </form>
                <div style={{margin: "1rem", textAlign: "center", fontSize: "0.9rem"}}>
                    Don't have an account?{" "}
                    <span
                        onClick={() => navigate("/register")}
                        style={{fontWeight: "bold", color: "#0a1d49", cursor: "pointer"}}
                    >
                    Sign up
                    </span>
                </div>

            </div>

            {/* Toast */}
            {toast && <Toast message={toast.message} isPositive={toast.isPositive}/>}
        </div>
    );
};

export default LoginPage;
