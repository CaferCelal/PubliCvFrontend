import { BrowserRouter, Routes, Route } from "react-router-dom";
import Test from "./pages/Test.tsx";
import LoginPage from "./pages/login-page.tsx";
import LandingPage from "./pages/landing-page.tsx";
import ForgotPasswordPage from "./pages/forgot-password-page.tsx";
import RegistrationPage from "./pages/reset-password-page.tsx";
import ResetPasswordPage from "./pages/reset-password-page.tsx";
import ProfilePage from "./pages/profile-page.tsx";
import PdfViewer from "./pages/pdf-viewer.tsx";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/pdf-test" element={<PdfViewer />}/>
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/forgot-password/reset-password" element={<ResetPasswordPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage/>} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="home" element={<LandingPage />} />
                <Route path="/" element={<Test />} />
                <Route path="/register" element={<RegistrationPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
