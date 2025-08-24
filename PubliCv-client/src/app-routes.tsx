import { BrowserRouter, Routes, Route } from "react-router-dom";
import Test from "./pages/Test.tsx";
import TestForgotPassword from "./pages/test-forgot-password.tsx";
const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Test />} />
                <Route path="/forgot-password/reset-password" element={<TestForgotPassword />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
