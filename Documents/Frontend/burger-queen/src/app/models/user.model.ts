export interface UserRequest{
    name: string;
    phone: string;
    email: string;
    cpf: string;
    password: string;
}

export interface LoginRequest{
    email: string;
    password: string;
}

export interface LoginResponse{
    token: string;
}

export interface ActivateRequest{
    code: string;
}