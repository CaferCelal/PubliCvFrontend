import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Test from "./pages/Test.tsx";
import LoginPage from "./pages/login-page.tsx";
import LandingPage from "./pages/landing-page.tsx";
import ForgotPasswordPage from "./pages/forgot-password-page.tsx";
import ResetPasswordPage from "./pages/reset-password-page.tsx";
import ProfilePage from "./pages/profile-page.tsx";
import PublicFilePage from "./pages/public-file-page.tsx";
import RegisterPage from "./pages/register-page.tsx";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="home" element={<LandingPage />} />

                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/forgot-password/reset-password" element={<ResetPasswordPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage/>} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/:userName/:fileId" element={<PublicFilePage />} />

                <Route path="/test" element={<Test />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
