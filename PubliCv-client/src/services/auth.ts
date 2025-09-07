// services/auth.ts
import Config from "./config";
import type { RegisterDto } from "../dtos/register-dto";
import type { LoginDto } from "../dtos/login-dto";
import type { ResetPasswordWithTokenDto } from "../dtos/reset-password-with-token-dto.ts";

export interface ApiResponse<T> {
    data: T;
    status: number;
}

const AuthServices = {
    registerUser(dto: RegisterDto): Promise<ApiResponse<string>> {
        return fetch(`${Config.DOMAIN}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dto),
        }).then(async (res) => {
            const data = await res.json();
            return {
                status: res.status,
                data,
            };
        });
    },

    loginUser(dto: LoginDto): Promise<{ status: number; data: any }> {
        return fetch(`${Config.DOMAIN}/auth/login`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dto),
        }).then(async (res) => {
            const data = await res.json();
            return { status: res.status, data };
        });
    },

    logoutUser(): Promise<ApiResponse<string>> {
        return fetch(`${Config.DOMAIN}/auth/logout`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json());
    },

    forgotPassword(email: string): Promise<ApiResponse<string>> {
        return fetch(`${Config.DOMAIN}/auth/forgot-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        }).then((res) => res.json());
    },

    resetPasswordWithToken(dto: ResetPasswordWithTokenDto): Promise<ApiResponse<string>> {
        return fetch(`${Config.DOMAIN}/auth/forgot-password/reset-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dto),
        }).then((res) => res.json());
    }
};

export default AuthServices;
