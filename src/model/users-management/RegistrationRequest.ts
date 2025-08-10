export interface RegistrationRequest {
    nickname: string;
    email: string;
}

export interface CompleteRegistrationRequest extends RegistrationRequest {
    password: string;
}
