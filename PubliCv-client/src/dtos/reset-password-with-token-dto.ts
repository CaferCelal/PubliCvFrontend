// dtos/reset-password-with-token-dto.ts
export interface ResetPasswordWithTokenDto {
    token:string;
    email: string;
    newPassword: string;
}