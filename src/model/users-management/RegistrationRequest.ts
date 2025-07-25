import type { BasicUser } from "./User";

export interface RegistrationRequest {
    nickname: string;
    email: string;
    passwordHash: string;
}
